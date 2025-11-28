
## Background and References

A [blog](https://en.wikipedia.org/wiki/Blog) (AKA web log) is an informational website designed to allow a user to post text information.  These posts are often in a diary style and/or an indication of what is on the creator's thoughts at the given time.

A [hashtag](https://en.wikipedia.org/wiki/Hashtag) is a classification symbol which allows blog posts to be labeled as a set type.  Users can use the hashtag for filtering blog posts to only those related to a specific interest.

This web application will utilize these ideas to create a blog with hashtags.  The data will be stored by the web server using a MongoDB database.  Your server will host the files for the web application as well as host an application programming interface (API) to allow the client to retrieve, create, and delete blog posts. 

The following are some helpful resources:

- Express API Documentation: [https://expressjs.com/en/api.html](https://expressjs.com/en/api.html)
- Mongoose API Documentation: [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)

## Project Description
A client user interface that must consist of the following:

A set of inputs allowing the user to write a blog post and set an optional hashtag
A display area showing the list of blog posts displayed sorted by the date of creation
An input allowing a user to filter based on hashtag
A server that must consist of the following:

Static hosting of the client application
An API to create, retrieve, and delete blog post entries
