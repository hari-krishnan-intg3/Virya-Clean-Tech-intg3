# WordPress Connector

A local Node.js dashboard for the WordPress REST API at `https://team.trustgrid.ai`.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. In WordPress, create an Application Password for the `poojasri` account and put it in `.env` as `WP_APP_PASSWORD`. Do not use the regular wp-admin password; it is rejected by the REST API.
4. Start the local dashboard with `npm run dev` and open `http://127.0.0.1:4170`.

The Application Password stays on the local Node server and is never sent to the browser. Without it, the dashboard still opens in setup mode but disables writes. The local server binds only to `127.0.0.1`.

## Available actions

- Publish a post.
- Update a post by ID, including title, content, and status.
- Save a post as a draft.
- Schedule a post in the WordPress site timezone.
- Publish a page.
- Update a page by ID.
- Upload an image, PDF, or video to Media Library (up to 32 MB).
- Upload a file, then create a post using it as the featured image.
- Create a category.
- Add a category to a post without removing its existing categories.

Post and category pickers can load choices from WordPress after credentials are configured. Uploading a file with a post creates the media first; if post creation then fails, the uploaded media remains in Media Library.

The older comment command remains available as `npm run comment:hello`.

## Credentials

`.env` is ignored by Git. Never commit or share it. Use an Application Password dedicated to this connector and revoke it from the WordPress profile when it is no longer needed.
