import * as argon2 from 'argon2'

export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1
    })
  }

  static async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}