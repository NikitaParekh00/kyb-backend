import express from 'express';
import { Kyb } from '../controllers/kyb.js';

const router = express.Router();

router.route('/kyb').get(Kyb);

export default router;