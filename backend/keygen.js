const crypto = require('crypto');

function generateSecretKey() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) reject(err);
      const secretKey = buf.toString('hex');
      resolve(secretKey);
    });
  });
}

// Usage
generateSecretKey()
  .then(secretKey => {
    console.log('Your secret key:', secretKey);
  })
  .catch(err => {
    console.error('Error generating secret key:', err);
  });
