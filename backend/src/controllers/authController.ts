// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username dan password diperlukan' });
        return;
      }

      const authResponse = await authService.login({ username, password });

      res.status(200).json(authResponse);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await authService.getCurrentUser(userId);

      if (!user) {
        res.status(404).json({ error: 'User tidak ditemukan' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
