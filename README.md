# Student Project Tracker

A hands-on web app development workshop project. It adds, displays, edits and deletes engineering projects, with data stored in local SQLite.

## Run locally
Use the workshop Node 22 baseline (at least 22.18, below 23), Git and VS Code.
Open a PowerShell terminal inside the project, then run:

    npm.cmd ci
    npm.cmd start

Open http://localhost:3000. Stop the server with Ctrl+C.

## How it works
Browser HTML/CSS/JavaScript -> fetch/HTTP -> Express API -> SQLite -> JSON response -> updated page.
- public/index.html: page structure and form.
- public/style.css: appearance and responsive layout.
- public/script.js: input, API requests, rendering and feedback.
- server.js: starts the local server.
- app.js: routes, validation and responses.
- database.js: SQLite operations; creates data/projects.db locally.

## API
GET /api/health; GET and POST /api/projects; PUT and DELETE /api/projects/:id.

## Verification
 - Manual verification: Tested CRUD operations in browser (adding, editing, deleting, blocking duplicate submissions).
- Automated test run: Executed `npm test` using `test/crud.test.js`.
- Result: **1 passed, 0 failed**..


## Workshop limitations
This local teaching app has no sign-in or per-user permissions. Browsers calling the same server share its collection. The SQLite data file and node_modules are not uploaded to GitHub. Cloud hosting requires separate server and database configuration.