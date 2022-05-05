class Post {
    constructor(
        username,
        name,
        _id,
        content,
        file,
        date,
        upvotes,
        downvotes,
        usersUpvoted,
        usersDownvoted
    ) {
        this.username = username;
        this.name = name;
        this._id = _id;
        this.content = content;
        this.file = file;
        this.date = date;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.usersUpvoted = usersUpvoted;
        this.usersDownvoted = usersDownvoted;
    }
}

module.exports = Post;
