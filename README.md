
# Note-sharing Web App
This is a demo application I made for presenting core concepts on REST APIs.

Its features include:

1. A simple login/logout (username only) for accessing protected routes
2. Posting notes for another user
3. Notes CRUD
4. Users CRUD

# Tech Specs
* Runs on Node.js 
* Uses Express Framework
* Connects to a MongoDB instance with mongoose library 
* For auth, it just stores the logged-in user in the cookies

# Credits:
This repo is forked from this project: [Vanaldito/React-and-Express-boilerplate](https://github.com/Vanaldito/React-and-Express-boilerplate)

# Requirements

You most have installed `node` (with npm), and the package `concurrently`.
You can do it with the next commands:

For a global installation:

```npm install -g concurrently```
or
```yarn global add concurrently```

For a local installation:

```npm install --save-dev concurrently```
or
```yarn add --dev concurrently```

# Installation

Run the commands to clone this repository and start the project on your local server
``` bash
# clone the repo
git clone https://github.com/carljo-reyes/rest-demo-notes.git
cd rest-demo-notes
# 
npm install --save-dev concurrently
npm run dev
```
