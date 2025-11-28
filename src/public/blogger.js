/*
 * Class: SWE2511 - Blogger
 * Name: Kalkidan Vassar
 * Section: 131
 *
 * Blogger client user interface routines
 */

window.onload = () => {

    // ----- DOM ELEMENTS -----
    const postText = document.getElementById('postText');
    const hashtagInput = document.getElementById('hashtagInput');
    const makePostBtn = document.getElementById('makePost');
    const formError = document.getElementById('formError');

    const postFilter = document.getElementById('postFilter');
    const filterInput = document.getElementById('filterInput');
    const postsList = document.getElementById('postsList');
    const noPosts = document.getElementById('noPosts');


    // ----- VALIDATION USING UTILITY FUNCTIONS -----

    function validPostText(text) {
        return isNonEmptyString(text.trim());
    }

    function validHashtag(tag) {
        if (!isDefined(tag) || tag.trim() === "") return true; // optional
        if (tag[0] !== "#") return false;
        const after = tag.substring(1);
        return isNonEmptyString(after) &&
            startsWithLetter(after) &&
            isAlphaNumeric(after);
    }

    function showFormError(msg) {
        formError.textContent = msg;
        formError.classList.remove('hidden');
    }

    function hideFormError() {
        formError.textContent = '';
        formError.classList.add('hidden');
    }


    // ----- RENDER POSTS -----

    function renderPosts(posts) {
        postsList.innerHTML = "";

        if (!posts || posts.length === 0) {
            postFilter.classList.add('hidden');
            noPosts.classList.remove('hidden');
            return;
        } else {
            noPosts.classList.add('hidden');
            postFilter.classList.remove('hidden');
        }

        const filterText = (filterInput.value || "").trim().toLowerCase();

        posts.forEach(p => {
            const hasTag = isDefined(p.hashtag);

            // Apply filter (case-insensitive search on hashtag ONLY)
            if (filterText) {
                if (!hasTag) return;
                if (!p.hashtag.toLowerCase().includes(filterText)) return;
            }

            const card = document.createElement("div");
            card.className = "postCard";

            const header = document.createElement("div");
            header.className = "postHeader";

            // Timestamp
            const time = document.createElement("div");
            const dt = new Date(p.creation_date);
            time.textContent = `Posted on ${dt.toLocaleDateString()} at ${dt.toLocaleTimeString()}`;

            // Delete button
            const delBtn = document.createElement("button");
            delBtn.className = "delete";
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", () => handleDelete(p._id));

            header.append(time, delBtn);
            card.appendChild(header);

            // Optional hashtag
            if (hasTag) {
                const tag = document.createElement("div");
                tag.className = "hashtag";
                tag.textContent = p.hashtag;
                card.appendChild(tag);
            }

            // Post body
            const body = document.createElement("div");
            const textP = document.createElement("p");
            textP.textContent = p.post;
            body.appendChild(textP);

            card.appendChild(body);

            postsList.appendChild(card);
        });
    }


    // ----- API CALLS WRAPPED WITH bloggerAPI.js -----

    async function fetchAndRender() {
        hideFormError();
        try {
            const data = await getPosts();
            if (data.status !== "success") {
                showFormError(data.error ?? "Server returned an error retrieving posts.");
                return;
            }
            renderPosts(data.posts);
        } catch (err) {
            showFormError("Network error retrieving posts: " + err.message);
        }
    }

    async function handleCreate() {
        hideFormError();

        const post = postText.value.trim();
        const hashtag = hashtagInput.value.trim();

        // Validate post text
        if (!validPostText(post)) {
            showFormError("Post content is required.");
            return;
        }
        // Validate hashtag format
        if (!validHashtag(hashtag)) {
            showFormError("Invalid hashtag. Must start with # then a letter, followed by letters/numbers only.");
            return;
        }

        try {
            const result = await createPost(post, hashtag);

            if (result.status !== "success") {
                showFormError(result.error ?? "Server error creating post.");
                return;
            }

            // Clear inputs but keep filter state
            postText.value = "";
            hashtagInput.value = "";

            await fetchAndRender();

        } catch (err) {
            showFormError("Network/server error: " + err.message);
        }
    }

    async function handleDelete(id) {
        hideFormError();
        try {
            const result = await deletePost(id);

            if (result.status !== "success") {
                showFormError(result.error ?? "Server error deleting post.");
                return;
            }

            await fetchAndRender();

        } catch (err) {
            showFormError("Network/server error: " + err.message);
        }
    }

    filterInput.addEventListener('input', fetchAndRender);

    makePostBtn.addEventListener('click', handleCreate);

    fetchAndRender();
};
