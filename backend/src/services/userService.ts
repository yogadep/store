// src/services/user.service.ts
import prisma from '../prisma/client'
import { User } from '@prisma/client'

export class UserService {
  async createUser(data: Omit<User, 'id'>) {
    return prisma.user.create({ data })
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