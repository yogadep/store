// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; username: string };
    }
  }
}

export class AuthMiddleware {
  private static JWT_SECRET = process.env.JWT_SECRET || 'rahasia-jwt-sangat-aman';

  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ error: 'Token tidak ditemukan' });
        return;
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        res.status(401).json({ error: 'Format token tidak valid' });
        return;
      }

      const decoded = jwt.verify(token, AuthMiddleware.JWT_SECRET) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, username: true },
      });

      if (!user) {
        res.status(401).json({ error: 'User tidak ditemukan' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'Token tidak valid' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, AuthMiddleware.JWT_SECRET, { expiresIn: '24h' });
  }
}
