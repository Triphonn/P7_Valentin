# Back-End for P7_Groupomania

This is the back-end of the Groupomania Social Network project.

Here you can find all your back routes and stuff.

You can run your project with free database hosting like [Clever Cloud](https://www.clever-cloud.com/fr/).

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

An example file is already existing with these variables, you can just edit with yours.

(Follow the template.env file) And you will need a database using mysql (for sequelize).

This is for the authentification token granted by jsonWebToken to the user, you can put whatever you want.

jsonWebToken is a plugin that allows you to verify if user's token is valid to his account, if not it will block the request.

`AUTH_TOKEN=`

You have now all your environment variables to start the project.

## Installation

Install the back-end with npm, that you've installed with [NodeJS](https://nodejs.org/en/download/).

First, open a new terminal.

Now, go to the back directory :

```bash
cd back
```

And then, you can use npm to install all the specific tools and dependencies for this project :

```bash
npm install
```

Nodemon has some issues right now, so you need to install it globaly :

```bash
npm install -g nodemon
```

If your environment variables are up and you install all the dependencies with npm, you can now start the project using :

Nodemon will start your project and connect the database to you. If you have some issues starting the server, make sure your environment variables are all fulfilled and correct.

```bash
nodemon server
```

If you have some issues with the installation, try this :

Open a Powershell in Admin mode and paste this command :

```bash
Set-ExecutionPolicy Unrestricted
```

Now you can close the Powershell and it should work.

Now that you started your back, you can return on the main README to start the front.
