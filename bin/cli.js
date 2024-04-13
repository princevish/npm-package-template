import { execSync } from "child_process";

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute: ${command} \n `, error);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const gitHubRepo = "https://github.com/princevish/npm-package-template.git";
const gitCheckoutCommand = `git clone --depth 1 ${gitHubRepo} ${repoName}`;

const installCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repository with name ${repoName}`);

const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) {
  console.error("Failed to clone the repository");
  process.exit(-1);
}

console.log(`Installing dependencies for ${repoName}`);

const installed = runCommand(installCommand);

if (!installed) {
  console.error("Failed to install dependencies");
  process.exit(-1);
}

console.log(
  "Congratulations! You are ready to start. Follow the following commands to start"
);

console.log(`cd ${repoName}`);
console.log("npm run build");
console.log("npm run version");
console.log("npm run publish");
