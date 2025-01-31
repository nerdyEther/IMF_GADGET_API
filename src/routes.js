const express = require('express');
const { authenticate, authorize } = require('./middlewares');
const {
  getGadgets,
  createGadget,
  updateGadget,
  decommissionGadget,
  selfDestruct
} = require('./handlers');

const router = express.Router();

router.get('/gadgets', authenticate, authorize('admin', 'agent'), getGadgets);
router.post('/gadgets', authenticate, authorize('admin'), createGadget);
router.patch('/gadgets/:id', authenticate, authorize('admin'), updateGadget);
router.delete('/gadgets/:id', authenticate, authorize('admin'), decommissionGadget);
router.post('/gadgets/:id/self-destruct', authenticate, authorize('admin', 'agent'), selfDestruct);

module.exports = router;