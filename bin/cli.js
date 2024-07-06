#!/usr/bin/env node
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute: ${command} \n `, error);
    return false;
  }
  return true;
};

const deleteFolder = (directoryPath) => {

  try {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error deleting directory: ${err} \n`);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
if (!repoName) {
  console.error("Please provide a folder name");
  process.exit(-1);
}
const gitHubRepo = "https://github.com/princevish/npm-package-template.git";
const gitCheckoutCommand = `git clone --depth 1 ${gitHubRepo} ${repoName}`;

const installCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repository with name ${repoName} \n`);

const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) {
  console.error("Failed to clone the repository");
  process.exit(-1);
}

console.log(`Installing dependencies for ${repoName} \n`);

const installed = runCommand(installCommand);

if (!installed) {
  console.error("Failed to install dependencies \n");
  process.exit(-1);
}

const binFolder = path.join(__dirname, repoName, "bin");
if (!deleteFolder(binFolder)) {
  process.exit(-1);
}
console.log(
  " \n Congratulations! You are ready to start. Follow the following commands to start \n"
);

console.log(`cd ${repoName} \n`);
console.log("npm run build \n");
console.log("npm run version \n");
console.log("npm run publish \n");

console.log(`Happy Coding! 🚀 \n`);