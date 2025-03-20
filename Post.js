export class Post {
  constructor(postID, username, title, content, footnotes) {
    this.postID = postID;
    this.postDate = new Date().toDateString();
    this.updateTime = null;
    this.username = username;
    this.title = title;
    this.content = content;
    this.footnotes = footnotes;
  }

  updatePost(username, title, content, footnotes) {
    this.username = username;
    this.title = title;
    this.content = content;
    this.footnotes = footnotes;
    this.updateTime = new Date().toDateString();
  }
}