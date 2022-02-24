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

// Number used once.
let nonce = 0;

// Naively get a message for the commit.
// Warning: This is not safe for untrusted input.
const message = process.argv.slice(2).join(" ");

console.log("Updating the hash with this message: " + message);

const now = Number(new Date());

while (true) {
  const seconds = nonce * 1000;
  const nonceDate = new Date(now + seconds).toISOString();
  run(`git commit --amend --no-edit --date "${nonceDate}"`);

  const hash = getHeadHash();
  console.log(hash, nonce);

  if (hash.startsWith("000")) {
    // We found a match!
    break;
  }

  // Get a new number
  nonce++;
}
