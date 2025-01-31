
const { PrismaClient } = require('@prisma/client');
const { generateCodename } = require('./src/utils');

const prisma = new PrismaClient();

const gadgets = [
  {
    name: "Laser Watch",
    status: "AVAILABLE"
  },
  {
    name: "Invisibility Cloak",
    status: "DEPLOYED"
  },
  {
    name: "Sonic Disruptor",
    status: "AVAILABLE"
  },
  {
    name: "Quantum Decoder",
    status: "DECOMMISSIONED"
  },
  {
    name: "Neural Scrambler",
    status: "DESTROYED"
  }
];

async function testData() {
  try {
  
    console.log('Cleaning up existing data...');
    const deletedCount = await prisma.gadget.deleteMany({});
    console.log(`Deleted ${deletedCount.count} existing gadgets`);
    
    
    console.log('\nAdding new gadgets...');
    for (const gadget of gadgets) {
      let codename;
      let isCodenameUnique = false;

      while (!isCodenameUnique) {
        codename = generateCodename();
        const existingCodename = await prisma.gadget.findUnique({
          where: { codename }
        });
        if (!existingCodename) {
          isCodenameUnique = true;
        }
      }

      const data = {
        name: gadget.name,
        codename,
        status: gadget.status,
      };

      if (gadget.status === 'DECOMMISSIONED') {
        data.decommissionedAt = new Date();
      }

      const createdGadget = await prisma.gadget.create({ data });
      console.log(`Created gadget: ${gadget.name} with codename: ${codename}`);
    }

    console.log('\nData uploaded successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testData();