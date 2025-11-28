/*
 * Class: SWE2511 - Blogger
 * Name: Kalkidan Vassar
 * Section: 131
 *
 * Blogger API Functions
 */

const server = 'localhost';
const getPostsURL = `http://${server}:3000/posts`;
const createPostURL = `http://${server}:3000/post`;
const deletePostURL = `http://${server}:3000/post`;

const getPosts = async () => {
    const res = await fetch(getPostsURL);
    return res.json();  // {status, posts}
};

const createPost = async (post, hashtag) => {
    const body = { post };
    if (hashtag) body.hashtag = hashtag;

    const res = await fetch(createPostURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    return res.json();
};

const deletePost = async (id) => {
    const res = await fetch(`${deletePostURL}?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
    return res.json();
};

// make usable in app.js
window.getPosts = getPosts;
window.createPost = createPost;
window.deletePost = deletePost;

