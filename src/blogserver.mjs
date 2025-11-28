/*
 * Class: SWE2511 - Blogger
 * Name: Kalkidan Vassar
 * Section: 131
 *
 * Blog Server
 */

import express from 'express';
import mongoose from 'mongoose';


/*** Helper functions for parameter validation ***/
const isDefined = (value) => (
    value !== undefined && value !== null && typeof(value) !== 'undefined'
);

const isNonEmptyString = (value) => (
    isDefined(value) && typeof(value) === "string" && value.trim().length > 0
);

// allow only letters & digits
const isAlphaNumeric = (text) => {
    const alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ".split('');
    return text
        .split('')
        .map((char) => alphanumeric.includes(char))
        .every((el) => el === true);
};

const startsWithLetter = (text) => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ".split('');
    return letters.includes(text[0]);
};




// ========== MongoDB Connection and Schema Setup =============

try {
    await mongoose.connect('mongodb://127.0.0.1:27017/blog');
} catch (error) {
    console.log(`Unable to connect to mongodb: ${error}`);
    process.exit();
}

const postSchema = new mongoose.Schema({
    post: { type: String, required: true },
    hashtag: { type: String, required: false },
    creation_date: { type: Date, required: true, default: Date.now }
});

const PostModel = mongoose.model("posts", postSchema);





// ================== EXPRESS INITIALIZATION ===================


const app = new express();
app.use(express.json());
app.use(express.static("public", { index: "blogger.html" }));





// ==================== API ENDPOINTS ==========================

/*
 * GET /posts
 * Returns all blog posts sorted newest → oldest
 */
app.get("/posts", async (req, res) => {
    const posts = await PostModel.find().sort({ creation_date: -1 });

    // Remove undefined hashtags (assignment requirement)
    const formatted = posts.map(p => {
        let obj = {
            _id: p._id,
            post: p.post,
            creation_date: p.creation_date
        };
        if (isDefined(p.hashtag)) obj.hashtag = p.hashtag;
        return obj;
    });

    res.json({
        status: "success",
        posts: formatted
    });
});



/*
 * POST /post
 * Creates & stores a new blog post
 * Required: post
 * Optional: hashtag (must follow rules if present)
 */
app.post("/post", async (req, res) => {
    let { post, hashtag } = req.body;

    // --- Validation for "post" ---
    if (!isNonEmptyString(post)) {
        return res.json({
            status: "error",
            error: "Post text is required and must be non-empty"
        });
    }

    // prevent script injection
    post = post.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // --- Hashtag validation (only if given) ---
    if (isDefined(hashtag) && hashtag.length > 0) {
        if (hashtag[0] !== "#") {
            return res.json({ status: "error", error: "Hashtag must start with #" });
        }
        const body = hashtag.substring(1);

        if (!startsWithLetter(body)) {
            return res.json({ status: "error", error: "Hashtag must start with a letter after #" });
        }
        if (!isAlphaNumeric(body)) {
            return res.json({ status: "error", error: "Hashtag may only contain letters and numbers" });
        }

        // prevent script injection
        hashtag = hashtag.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } else {
        hashtag = undefined;  // store undefined if empty
    }

    // Create blog post document
    const newPost = new PostModel({
        post,
        hashtag: hashtag,
        creation_date: Date.now()
    });

    await newPost.save();

    // Build response format
    let output = {
        _id: newPost._id,
        post: newPost.post,
        creation_date: newPost.creation_date
    };
    if (isDefined(newPost.hashtag)) {
        output.hashtag = newPost.hashtag;
    }

    res.json({
        status: "success",
        post: output
    });
});



/*
 * DELETE /post?id=XXXX
 * Deletes a blog post by id
 */
app.delete("/post", async (req, res) => {
    const { id } = req.query;

    // Validate id exists
    if (!isDefined(id)) {
        return res.json({
            status: "error",
            error: "Parameter id is required"
        });
    }

    // Validate Mongo ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({
            status: "error",
            error: "Invalid MongoDB id format"
        });
    }

    // Find & delete post
    const deleted = await PostModel.findByIdAndDelete(id);

    if (!deleted) {
        return res.json({
            status: "error",
            error: "Post not found"
        });
    }

    let output = {
        _id: deleted._id,
        post: deleted.post,
        creation_date: deleted.creation_date
    };
    if (isDefined(deleted.hashtag)) {
        output.hashtag = deleted.hashtag;
    }

    res.json({
        status: "success",
        post: output
    });
});



/*
 * 404 — Any route not defined above
 */
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});




// ======================= START SERVER ========================

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});
