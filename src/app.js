const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Successfully connected to NeonDB');
  } catch (error) {
    console.error('Error connecting to NeonDB:', error);
    process.exit(1);
  }
};

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});