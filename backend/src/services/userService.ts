// src/services/user.service.ts
import prisma from '../prisma/client'
import { User } from '@prisma/client'
import { PasswordService } from '../utils/password.service'

export class UserService {
  async createUser(data: Omit<User, 'id'>) {
    const hashedPassword = await PasswordService.hashPassword(data.password)

    return prisma.user.create({ 
        data: {
          ...data,
          password: hashedPassword
        }
    })
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({ 
      where: { id },
      include: { product: true, profile: true }
    })
  }

  async updateUser(id: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data
    })
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } })
  }

  async getAllUsers() {
    return prisma.user.findMany({
      include: { product: true, profile: true }
    })
  }
}