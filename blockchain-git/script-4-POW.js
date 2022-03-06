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

console.log("Updating the hash with this message: " + message);

while (true) {
  // Amend the commit with a new commit message.
  run(`git commit --amend -m "${message}\n\n${nonce}"`);

  const hash = getHeadHash();
  console.log(hash, nonce);

  if (hash.startsWith("00")) {
    // We found a match!
    break;
  }

  // Get a new number
  nonce++;
}
