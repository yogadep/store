// src/services/auth.service.ts
import prisma from '../prisma/client';
import { PasswordService } from '../utils/password.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    name: string;
  };
  token: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Ambil user dari database berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username: credentials.username }
    });
    
    if (!user) {
      throw new Error('Username atau password salah');
    }
    
    // Verifikasi password menggunakan PasswordService dengan argon2
    const isPasswordValid = await PasswordService.verifyPassword(
      user.password,
      credentials.password
    );
    
    if (!isPasswordValid) {
      throw new Error('Username atau password salah');
    }
    
    // Generate token
    const token = AuthMiddleware.generateToken(user.id);
    
    // Kembalikan data user (tanpa password) dan token
    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      },
      token
    };
  }
  
  async getCurrentUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        profile: true
      }
    });
  }
}