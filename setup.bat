@ECHO off
ECHO Setting up environment for Nuxt...
WHERE node.exe >NUL 2>&1 || (
  ECHO Node.js not found. Please install Node.js from https://nodejs.org/en/download/
  EXIT /B 1
)
WHERE npm.cmd >NUL 2>&1 || (
  ECHO npm not found. Please install npm from https://nodejs.org/en/download/
  EXIT /B 1
)

ECHO Installing yarn...
corepack enable

ECHO Installing dependencies...
yarn install

ECHO Success! You can now run yarn dev to start the development server.
ECHO If you want to run the project, run yarn dev.
PAUSE