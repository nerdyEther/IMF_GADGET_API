const { PrismaClient } = require('@prisma/client');
const { generateCodename, generateConfirmationCode } = require('./utils');

const prisma = new PrismaClient();

const getGadgets = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const gadgets = await prisma.gadget.findMany({ where });
    
    if (gadgets.length === 0) {
      return res.json({ 
        message: 'No gadgets found', 
        data: [] 
      });
    }
    
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 31) + 70 
    }));

    res.json({ 
      message: 'Gadgets retrieved successfully',
      data: gadgetsWithProbability 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve gadgets' });
  }
};


const createGadget = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }


    const existingGadget = await prisma.gadget.findFirst({
      where: { name }
    });

    if (existingGadget) {
      return res.status(409).json({ error: 'Gadget with this name already exists' });
    }

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

    const gadget = await prisma.gadget.create({
      data: {
        name,
        codename,
        status: 'AVAILABLE'
      }
    });

    res.status(201).json({
      message: 'Gadget created successfully',
      data: gadget
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create gadget' });
  }
};


const updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

  
    const gadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

  
    if (gadget.status === 'DECOMMISSIONED' || gadget.status === 'DESTROYED') {
      return res.status(400).json({ 
        error: `Cannot update gadget with status: ${gadget.status}` 
      });
    }

   
    if ('status' in updates) {
     
      if (!updates.status || updates.status.trim() === '') {
        return res.status(400).json({ 
          error: 'Status cannot be empty' 
        });
      }

      const validStatuses = ['AVAILABLE', 'DEPLOYED', 'DESTROYED', 'DECOMMISSIONED'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Must be one of: AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED' 
        });
      }
    }


    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: cleanUpdates
    });

    res.json({
      message: 'Gadget updated successfully',
      data: updatedGadget
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update gadget' });
  }
};


const decommissionGadget = async (req, res) => {
  try {
    const { id } = req.params;

    const gadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    if (gadget.status === 'DECOMMISSIONED') {
      return res.status(400).json({ error: 'Gadget is already decommissioned' });
    }

    if (gadget.status === 'DESTROYED') {
      return res.status(400).json({ error: 'Cannot decommission a destroyed gadget' });
    }

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DECOMMISSIONED',
        decommissionedAt: new Date()
      }
    });

    res.json({
      message: 'Gadget decommissioned successfully',
      data: updatedGadget
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to decommission gadget' });
  }
};

const selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

   
    if (!confirmationCode || confirmationCode.length !== 6 || !/^\d+$/.test(confirmationCode)) {
      return res.status(400).json({ 
        error: 'Please provide a valid 6-digit confirmation code' 
      });
    }

    const gadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    if (gadget.status === 'DESTROYED') {
      return res.status(400).json({ error: 'Gadget is already destroyed' });
    }

    if (gadget.status === 'DECOMMISSIONED') {
      return res.status(400).json({ error: 'Cannot destroy a decommissioned gadget' });
    }


    const backendConfirmationCode = Math.floor(100000 + Math.random() * 900000).toString();


    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: { 
        status: 'DESTROYED'
      }
    });

    
    res.json({
      message: 'Gadget successfully destroyed',
      data: updatedGadget,
      backendConfirmationCode
    });

  } catch (error) {
    console.error('Self-destruct error:', error); 
    res.status(400).json({ error: 'Failed to complete self-destruct sequence' });
  }
};


module.exports = {
  getGadgets,
  createGadget,
  updateGadget,
  decommissionGadget,
  selfDestruct,

};
