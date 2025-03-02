import prisma from '../prisma/client';

export interface ProductData {
  title: string;
  description?: string;
  price: number;
  stock: number;
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export class ProductService {
  async createProduct(productData: ProductData, userId: string): Promise<ProductResponse> {
    // Buat produk baru dengan userId dari token sebagai authorId
    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        author: {
          connect: { id: userId } // Hubungkan dengan user berdasarkan ID dari token
        }
      }
    });
    
    return newProduct;
  }

  async getProducts(userId?: string): Promise<ProductResponse[]> {
    // Ambil semua produk, bisa difilter berdasarkan userId jika disediakan
    const filter = userId ? { authorId: userId } : {};
    
    return prisma.product.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getProductById(id: string): Promise<ProductResponse | null> {
    // Ambil produk berdasarkan ID
    return prisma.product.findUnique({
      where: { id }
    });
  }

  async updateProduct(id: string, productData: Partial<ProductData>, userId: string): Promise<ProductResponse> {
    // Pastikan produk ada dan milik user yang meminta update
    const product = await prisma.product.findFirst({
      where: {
        id,
        authorId: userId
      }
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya');
    }

    // Update produk
    return prisma.product.update({
      where: { id },
      data: productData
    });
  }

  async deleteProduct(id: string, userId: string): Promise<ProductResponse> {
    // Pastikan produk ada dan milik user yang meminta delete
    const product = await prisma.product.findFirst({
      where: {
        id,
        authorId: userId
      }
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya');
    }

    // Hapus produk
    return prisma.product.delete({
      where: { id }
    });
  }

  async publishProduct(id: string, userId: string): Promise<ProductResponse> {
    // Pastikan produk ada dan milik user yang meminta publish
    const product = await prisma.product.findFirst({
      where: {
        id,
        authorId: userId
      }
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan atau Anda tidak memiliki izin untuk mempublikasikannya');
    }

    // Update status published menjadi true
    return prisma.product.update({
      where: { id },
      data: { published: true }
    });
  }

  async unpublishProduct(id: string, userId: string): Promise<ProductResponse> {
    // Pastikan produk ada dan milik user yang meminta unpublish
    const product = await prisma.product.findFirst({
      where: {
        id,
        authorId: userId
      }
    });

    if (!product) {
      throw new Error('Produk tidak ditemukan atau Anda tidak memiliki izin untuk membatalkan publikasinya');
    }

    // Update status published menjadi false
    return prisma.product.update({
      where: { id },
      data: { published: false }
    });
  }
}