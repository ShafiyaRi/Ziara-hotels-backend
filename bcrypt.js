const bcrypt = require('bcryptjs');

const plainPassword = 'adminuser321'; 
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});