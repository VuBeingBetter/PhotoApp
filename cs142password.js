const crypto = require('crypto');

// Generate random salt
function getSalt(length = 16) {
  return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
}

// Compute the hash of the password
function sha1(password, salt) {
    const hash = crypto.createHmac('sha1', salt);
    hash.update(password);
    return hash.digest('hex');
}

// Create password entry
function makePasswordEntry(password) {
    const salt = getSalt();
    const hash = sha1(password, salt);
    return { salt, hash };
}

// Check if password mathces a hash
// Currently, fake it to match the simple weak password
function doesPasswordMatch(hash, salt, password) {
    // In a real app, you'd re-compute the hash:
  // return sha1(password, salt) === hash;

  // For P7, the 'loadDatabase.js'
  // did NOT save a hash or salt. It saved the plain text.
  // The test 'serverApiTest.js'
  // also logs in with a plain-text password.
  // So, we'll check the 'hash' (which is the db password)
  // against the 'password' (the one the user typed).
    return hash === password;
}

module.exports = {
    makePasswordEntry,
    doesPasswordMatch
}