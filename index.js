import express from "express";
import bodyParser from "body-parser";
import { Post } from "./Post.js";
import { useTestData } from "./test_data.js";

const app = express();
const port = 3000;

const state = {
  websiteTitle: "Super Blog",
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

let posts = []; // An array of Post objects
let currentMaxID = 0; // Increment this every time a post is made

function createNewPost(username, title, content, footnotes) {
  const newPostID = ++currentMaxID;
  const newPost = new Post(newPostID, username, title, content, footnotes);
  posts.push(newPost);
  return newPostID;
}

function getPost(postID) {
  // The postID was invalid
  if (postID > currentMaxID || postID < 0) return null;

  // Try to update the post if it exists in the array of posts
  for (let postIndex = 0; postIndex < posts.length; postIndex++) {
    const element = posts[postIndex];
    if (element == null) continue;

    if (element.postID == postID) {
      // update the post
      return element;
    }
  }
  return null;
}

function updatePost(postID, username, title, content, footnotes) {
  // The postID was invalid
  if (postID > currentMaxID || postID < 0) return false;

  // Can have empty fields, not not null fields
  if (
    postID == null ||
    username == null ||
    title == null ||
    content == null ||
    footnotes == null
  )
    return false;

  // Try to update the post if it exists in the array of posts
  for (let postIndex = 0; postIndex < posts.length; postIndex++) {
    const element = posts[postIndex];
    if (element == null) continue;

    if (element.postID == postID) {
      // TODO check if JS is pass by pointer
      // update the post
      element.updatePost(username, title, content, footnotes);
      return true;
    }
  }
  return false;
}

function deletePost(postID) {
  // The postID was invalid
  if (postID > currentMaxID || postID < 0) return false;

  // Try to update the post if it exists in the array of posts
  for (let postIndex = 0; postIndex < posts.length; postIndex++) {
    const element = posts[postIndex];
    if (element == null) continue;

    if (element.postID == postID) {
      // delete the post
      posts.splice(postIndex, 1);
      return true;
    }
  }
  return false;
}

// Render the Home page
app.get("/", (req, res) => {
  res.locals.websiteTitle = state.websiteTitle;
  res.locals.posts = posts;
  res.render("index.ejs");
});

// Render the post creation page
app.get("/post/create", (req, res) => {
  res.locals.websiteTitle = state.websiteTitle;
  res.locals.formType = "create";
  res.render("post_form.ejs");
});

app.post("/post/create", (req, res) => {
  let postID = createNewPost(
    req.body.username,
    req.body.title,
    req.body.content,
    req.body.footnotes
  );
  res.redirect(`/post/${postID}`);
});

app.get("/post/update/:postID", (req, res) => {
  res.locals.websiteTitle = state.websiteTitle;
  res.locals.formType = "update";
  res.locals.post = getPost(req.params["postID"]);
  if (res.locals.post == null) res.redirect("/");
  else res.render("post_form.ejs");
});

// Update a post
app.post("/post/update/:postID", (req, res) => {
  let success = updatePost(
    Number(req.params["postID"]),
    req.body.username,
    req.body.title,
    req.body.content,
    req.body.footnotes
  );

  console.log(
    success
      ? `Updated Post: ${req.params["postID"]}`
      : `Failed to upate post: ${req.params["postID"]}`
  );

  res.redirect("/");
});

function requestDeletePost(postID) {
  const success = deletePost(postID);
  const message = success
    ? `Deleted Post: ${postID}`
    : `Failed to delete post: ${postID}`;
  return message;
}
// Delete a post
// Can't use "DELETE" in HTML forms,
// so keep functionality in POST requests
app.post("/post/delete/:postID", (req, res) => {
  const message = requestDeletePost(req.params["postID"]);
  console.log(message);
  res.redirect("/");
});

app.delete("/post/delete/:postID", (req, res) => {
  const message = requestDeletePost(req.params["postID"]);
  res.send(message);
});

// Render a given post's page
app.get("/post/:postID", (req, res) => {
  res.locals.websiteTitle = state.websiteTitle;
  res.locals.post = getPost(req.params["postID"]);
  if (res.locals.post == null) res.redirect("/");
  else res.render("post_view.ejs");
});

// Use test data to populate app with content
currentMaxID = useTestData(posts);
