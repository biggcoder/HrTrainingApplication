import express from 'express';
const router = express.Router();
import {
  createProject,
  getProjects,
  updateProjectStatus,
  submitWork, // Import the new function
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes are protected
router.use(protect);

router.route('/').post(createProject).get(getProjects);
router.route('/:id/status').put(updateProjectStatus);
router.route('/:id/submit').post(submitWork); // Add the new route

export default router;