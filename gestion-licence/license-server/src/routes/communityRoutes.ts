import { Router } from 'express';
import { getMessages, uploadMedia, deleteMessage, communityUpload } from '../controllers/communityController';

const router = Router();

router.get('/messages', getMessages);
router.post('/upload', communityUpload.single('file'), uploadMedia);
router.delete('/messages/:id', deleteMessage); // admin only (validé dans socket / ou via header)

export default router;
