# Dashboard Backend

Small Express + TypeScript backend that accepts CSV uploads, parses them, and stores metadata in a MySQL database using Sequelize + sequelize-typescript.

## Highlights

- TypeScript-based Express server
- Multer for multipart uploads
- CSV parsing utilities
- Sequelize (MySQL) models and sync
- Swagger and logging dependencies included

## Prerequisites

- Node.js v16+ and npm
- A MySQL server (or compatible) accessible from your machine

## Environment

Copy `.env.example` to `.env` (or create a `.env`) and set the following variables as needed:

- PORT (default: 5000)
- DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
- NODE_ENV (set to `development` when working locally)

Example (.env):

DB_NAME=your_database
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
PORT=5000
NODE_ENV=development

> Note: The project uses `sequelize-typescript` and expects models under `src/database/models`.

## Install

Open a PowerShell terminal and run:

```powershell
npm install
```

## Development

Start the dev server with nodemon (runs `src/main.ts` directly):

```powershell
npm run dev
```

This will read `.env`, attempt to connect to the database, sync models, and start the server on http://localhost:5000 (or your configured `PORT`).

## Build & Production

Compile TypeScript into `dist/` using:

```powershell
npm run build
```

Then run the compiled output (or adjust the `start` script if you compile differently):

```powershell
npm run start
```

Note: The included `start` script currently runs `node src/main.ts`. For production you may want to change it to `node dist/main.js` after building.

## API Endpoints

All endpoints are prefixed with `/api` (see `src/main.ts`).

- POST /api/upload-csv
  - Accepts multipart form-data with a `file` field (CSV file)
  - Uses `multer` middleware
- GET /api/get-file-data
  - Returns file data by file id (middleware expects `file` field in the route)
- GET /api/get-columns
  - Returns detected CSV columns
- POST /api/get-data-by-columns
  - Accepts a JSON body describing columns to filter/return

Refer to `src/routes/uploader.routes.ts` and `src/controller/upload.controller.ts` for exact request and response shapes.

## Project Structure

- `src/main.ts` - Application entrypoint
- `src/routes` - Route registrations
- `src/controller` - Request handlers
- `src/service` - Business logic
- `src/database` - Sequelize setup and models
- `src/middleware` - Express middleware (multer, error handler)
- `src/common` - Utilities

## Notes & Next Steps

- Add a `.env.example` file to the repo to make env setup clearer.
- Update `start` script to run the built `dist` output for production.
- Consider adding tests and a Swagger UI endpoint if API docs are wanted (swagger deps are installed).
