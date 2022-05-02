class Post {
    constructor(
        _id,
        creator,
        description,
        upvotes,
        downvotes,
        usersUpvoted,
        usersDownvoted
    ) {
        this._id = _id;
        this.creator = creator;
        this.description = description;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.usersUpvoted = usersUpvoted;
        this.usersDownvoted = usersDownvoted;
    }
}

module.exports = Post;
