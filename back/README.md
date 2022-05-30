# Back-End for P7_Groupomania

This is the back-end of the Groupomania Social Network project.

Here you can find all your back routes and stuff.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

A file is already existing with these variables, you can just edit with yours.

This will connect your own database.

`PORT=3000`

`MYSQL_ADDON_HOST`

`MYSQL_ADDON_DB`

`MYSQL_ADDON_USER`

`MYSQL_ADDON_PASSWORD`

And this is for the token granted by jsonWebToken to the user.

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
