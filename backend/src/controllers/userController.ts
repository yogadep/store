// src/controllers/user.controller.ts
import { Request, Response } from 'express'
import { UserService } from '../services/userService'

const userService = new UserService()

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body)
      res.status(201).json(user)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id)
      user ? res.json(user) : res.status(404).json({ message: 'User not found' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(req.params.id, req.body)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userService.deleteUser(req.params.id)
      res.status(204).send()
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers()
      res.json(users)
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}