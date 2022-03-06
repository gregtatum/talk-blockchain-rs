const { execSync } = require('child_process');

/**
 * Return a command and get the result.
 */
function run(cmd) {
  return execSync(cmd, { encoding: "utf8" });
}

/**
 * Get the hash of the current git HEAD.
 */
function getHeadHash() {
  return run("git rev-parse HEAD").trim();
}

console.log("Head hash:", getHeadHash());
