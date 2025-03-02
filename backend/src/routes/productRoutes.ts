// src/routes/user.routes.ts
import { Router } from 'express'
import { ProductController } from '../controllers/productController'
import { AuthMiddleware } from '../middlewares/auth.middleware'

const router = Router()


router.post('/products', AuthMiddleware.authenticate, ProductController.createProduct)
      .get('/products', ProductController.getProducts)
      
router.get('/products/:id', ProductController.getProductById)
      .put('/products/:id', AuthMiddleware.authenticate, ProductController.updateProduct)
      .delete('/products/:id', AuthMiddleware.authenticate, ProductController.deleteProduct)
      .patch('/products/:id/publish', AuthMiddleware.authenticate, ProductController.publishProduct)
      .patch('/products/:id/unpublish', AuthMiddleware.authenticate, ProductController.unpublishProduct)

export default router