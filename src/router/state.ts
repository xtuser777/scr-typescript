import { Router } from 'express';
import StateController from '../controller/StateController';

const router = Router();

const controller = new StateController();

router.get('/', controller.getById);

export default router;
