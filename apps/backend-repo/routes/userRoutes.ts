import { Router } from 'express';
import { updateUserData, fetchUserData, login, getTopPotentialUsers } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.put('/update-user-data', authMiddleware, updateUserData);
router.get('/fetch-user-data', authMiddleware, fetchUserData);

router.get('/top-potential-users', getTopPotentialUsers);

export default router;