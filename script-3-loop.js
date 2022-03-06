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

// Naively get a message for the commit.
// Warning: This is not safe for untrusted input.
const message = process.argv.slice(2).join(" ");

// Number used once.
let nonce = 0;

for (let i = 0; i < 100; i++) {
  // Amend the commit with a new commit message.
  run(`git commit --amend -m "${message}\n\n${nonce}"`);

  console.log("Head hash:", getHeadHash());
}
