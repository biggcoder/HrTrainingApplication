import express from 'express';
const router = express.Router();
import { getUsers, assignMentor, getMyProfile } from '../controllers/userController.js'; // Import new controller
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.route('/me').get(protect, getMyProfile); // This route is just protected, not admin-only

// Admin-only routes below
router.use(protect, isAdmin);
router.route('/').get(getUsers);
router.route('/assign-mentor').put(assignMentor);

export default router;