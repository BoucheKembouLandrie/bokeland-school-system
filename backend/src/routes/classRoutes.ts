import { Router } from 'express';
import { getAllClasses, getClassById, createClass, updateClass, deleteClass, transferClasses } from '../controllers/classController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/action/transfer', transferClasses);

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;
