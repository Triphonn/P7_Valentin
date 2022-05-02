class userProfile {
    constructor(userId, name, username, bio, profilePicture, banner, date) {
        this.userId = userId;
        this.name = name;
        this.username = username;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.banner = banner;
        this.date = date;
    }
}

module.exports = userProfile;
