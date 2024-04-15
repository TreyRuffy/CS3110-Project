# Quizoot

---
## Setup

Install yarn using npm:

```bash
corepack enable
```

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev --host -o (--tunnel)
```
`--host will allow you to access the server from other devices on the same network`

`-o will open the browser automatically`

`--tunnel will setup a CloudFlare tunnel to access the server from anywhere`


Build the application for production:
```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```
