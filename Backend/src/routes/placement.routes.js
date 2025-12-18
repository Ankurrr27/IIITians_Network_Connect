import express from 'express';
import {
  createPlacement,
  getPlacementByCollege,
  upsertPlacementYear,
  
} from '../controllers/placement.controller.js';
import { getPlacementByCollegeName } from '../controllers/placement.controller.js';

const router = express.Router();

router.post('/', createPlacement); // once per college
router.patch('/:placementId/year', upsertPlacementYear);
router.get('/college/:collegeId', getPlacementByCollege);

router.get('/college-name/:name', getPlacementByCollegeName);

export default router;
