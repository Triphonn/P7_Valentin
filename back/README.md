# Back-End for P7_Groupomania

This is the back-end of the Groupomania Social Network project.

Here you can find all your back routes and stuff.

**Don't forget to create /videos folder & /images folders in the main folder in case you want to receive the files**

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT=3000`

This will automatically connect your own database.

`MYSQL_ADDON_HOST`

`MYSQL_ADDON_DB`

`MYSQL_ADDON_USER`

`MYSQL_ADDON_PASSWORD`

This is for the token granted by jsonWebToken to the user.

`AUTH_TOKEN=`

You have now all your environment variables to start the project.

## Installation

Install the back-end with npm

Make sure your cmd is in the /back folder, then :

```bash
npm install
```

If your environment variables are up and you install all the dependencies, you can now start the project using :

```bash
nodemon server
```

Now that you started your back, you can return on the main README to start the front.
