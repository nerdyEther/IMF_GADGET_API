const adjectives = ['Silent', 'Shadow', 'Phantom', 'Stealth', 'Midnight'];
const nouns = ['Eagle', 'Serpent', 'Dragon', 'Phoenix', 'Wolf'];

const generateCodename = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `The ${adjective} ${noun}`;
};

const generateConfirmationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = { generateCodename, generateConfirmationCode };