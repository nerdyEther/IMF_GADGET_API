const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, 
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};


const adminToken = generateToken('1', 'admin');
console.log('\nAdmin Token:');
console.log(adminToken);



const agentToken = generateToken('2', 'agent');
console.log('\n\nAgent Token:');
console.log(agentToken);
