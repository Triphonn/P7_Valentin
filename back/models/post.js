class Post {
    constructor(
        creator,
        _id,
        content,
        file,
        upvotes,
        downvotes,
        usersUpvoted,
        usersDownvoted
    ) {
        this.creator = creator;
        this._id = _id;
        this.content = content;
        this.file = file;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.usersUpvoted = usersUpvoted;
        this.usersDownvoted = usersDownvoted;
    }
}

module.exports = Post;
