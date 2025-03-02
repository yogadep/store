// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

const productService = new ProductService();

export class ProductController {
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      // Ambil userId dari token yang sudah divalidasi oleh middleware
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, description, price, stock } = req.body;
      
      // Validasi input
      if (!title || price === undefined || stock === undefined) {
        res.status(400).json({ error: 'Judul, harga, dan stok wajib diisi' });
        return;
      }

      if (typeof price !== 'number' || typeof stock !== 'number') {
        res.status(400).json({ error: 'Harga dan stok harus berupa angka' });
        return;
      }

      const productData = {
        title,
        description,
        price,
        stock
      };

      const newProduct = await productService.createProduct(productData, userId);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.myProducts === 'true' ? req.user?.id : undefined;
      const products = await productService.getProducts(userId);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID produk tidak valid' });
        return;
      }

      const product = await productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Produk tidak ditemukan' });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID produk tidak valid' });
        return;
      }

      const { title, description, price, stock } = req.body;
      
      // Validasi input
      if (price !== undefined && typeof price !== 'number') {
        res.status(400).json({ error: 'Harga harus berupa angka' });
        return;
      }

      if (stock !== undefined && typeof stock !== 'number') {
        res.status(400).json({ error: 'Stok harus berupa angka' });
        return;
      }

      const productData = {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock })
      };

      const updatedProduct = await productService.updateProduct(id, productData, userId);
      res.status(200).json(updatedProduct);
    } catch (error) {
      if ((error as Error).message.includes('tidak ditemukan') || (error as Error).message.includes('tidak memiliki izin')) {
        res.status(404).json({ error: (error as Error).message });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID produk tidak valid' });
        return;
      }

      await productService.deleteProduct(id, userId);
      res.status(200).json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      if ((error as Error).message.includes('tidak ditemukan') || (error as Error).message.includes('tidak memiliki izin')) {
        res.status(404).json({ error: (error as Error).message });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async publishProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID produk tidak valid' });
        return;
      }

      const publishedProduct = await productService.publishProduct(id, userId);
      res.status(200).json(publishedProduct);
    } catch (error) {
      if ((error as Error).message.includes('tidak ditemukan') || (error as Error).message.includes('tidak memiliki izin')) {
        res.status(404).json({ error: (error as Error).message });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }

  static async unpublishProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID produk tidak valid' });
        return;
      }

      const unpublishedProduct = await productService.unpublishProduct(id, userId);
      res.status(200).json(unpublishedProduct);
    } catch (error) {
      if ((error as Error).message.includes('tidak ditemukan') || (error as Error).message.includes('tidak memiliki izin')) {
        res.status(404).json({ error: (error as Error).message });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}