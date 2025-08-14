import type { Product, ProductId } from '../entities/Product'

export interface IProductRepository {
  findById(id: ProductId): Promise<Product | null>
  findByName(name: string): Promise<Product | null>
  findAll(): Promise<Product[]>
  findActive(): Promise<Product[]>
  findByCategory(categoryId: string): Promise<Product[]>
  findByTag(tag: string): Promise<Product[]>
  save(product: Product): Promise<Product>
  update(product: Product): Promise<Product>
  delete(id: ProductId): Promise<boolean>
  exists(id: ProductId): Promise<boolean>
  count(): Promise<number>
  countByCategory(categoryId: string): Promise<number>
  countByStatus(isActive: boolean): Promise<number>
}

export interface ProductSearchCriteria {
  categoryId?: string
  tags?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: {
    min: number
    max: number
  }
  inStock?: boolean
  isActive?: boolean
  searchTerm?: string
  limit?: number
  offset?: number
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchResult {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: ProductSearchFacets
}

export interface ProductSearchFacets {
  categories: Array<{ id: string; name: string; count: number }>
  priceRanges: Array<{ min: number; max: number; count: number }>
  ratings: Array<{ rating: number; count: number }>
  tags: Array<{ tag: string; count: number }>
}

export interface IProductRepositoryExtended extends IProductRepository {
  search(criteria: ProductSearchCriteria): Promise<ProductSearchResult>
  findLowStockProducts(threshold?: number): Promise<Product[]>
  findOutOfStockProducts(): Promise<Product[]>
  findProductsByRating(rating: number): Promise<Product[]>
  findRelatedProducts(productId: ProductId, limit?: number): Promise<Product[]>
  getStatistics(): Promise<ProductStatistics>
  bulkUpdateInventory(updates: Array<{ id: ProductId; quantity: number }>): Promise<number>
}

export interface ProductStatistics {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  productsByCategory: Record<string, number>
  averagePrice: number
  totalValue: number
  topRatedProducts: Product[]
  recentlyAddedProducts: Product[]
}
