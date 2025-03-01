// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route untuk login (menggunakan metode statis)
router.post('/login', AuthController.login);

// Route protected yang membutuhkan token
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

export default router;