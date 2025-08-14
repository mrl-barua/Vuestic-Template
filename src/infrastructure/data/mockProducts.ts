import type { Product } from '@/domain/entities/Product'
import { ProductFactory } from '@/domain/entities/Product'

export const mockProductCategories = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics', isActive: true },
  { id: 'clothing', name: 'Clothing & Fashion', slug: 'clothing', isActive: true },
  { id: 'home', name: 'Home & Garden', slug: 'home', isActive: true },
  { id: 'books', name: 'Books & Media', slug: 'books', isActive: true },
  { id: 'sports', name: 'Sports & Outdoors', slug: 'sports', isActive: true },
  { id: 'beauty', name: 'Beauty & Health', slug: 'beauty', isActive: true }
]

export const mockProducts: Product[] = [
  ProductFactory.create(
    '1',
    'Wireless Bluetooth Headphones',
    'Premium noise-canceling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    199.99,
    mockProductCategories[0],
    150
  ),
  ProductFactory.create(
    '2',
    'Smart Fitness Watch',
    'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
    299.99,
    mockProductCategories[0],
    75
  ),
  ProductFactory.create(
    '3',
    'Organic Cotton T-Shirt',
    'Comfortable and sustainable organic cotton t-shirt available in multiple colors and sizes.',
    29.99,
    mockProductCategories[1],
    200
  ),
  ProductFactory.create(
    '4',
    'Designer Denim Jeans',
    'Premium designer jeans with perfect fit and durable construction for everyday wear.',
    89.99,
    mockProductCategories[1],
    120
  ),
  ProductFactory.create(
    '5',
    'Smart Home Security Camera',
    '1080p HD security camera with night vision, motion detection, and cloud storage.',
    149.99,
    mockProductCategories[0],
    60
  ),
  ProductFactory.create(
    '6',
    'Garden Tool Set',
    'Complete set of essential gardening tools including shovel, rake, and pruning shears.',
    79.99,
    mockProductCategories[2],
    85
  ),
  ProductFactory.create(
    '7',
    'Bestselling Novel Collection',
    'Collection of award-winning novels from contemporary authors in beautiful hardcover.',
    49.99,
    mockProductCategories[3],
    300
  ),
  ProductFactory.create(
    '8',
    'Professional Yoga Mat',
    'Non-slip yoga mat made from eco-friendly materials, perfect for home and studio practice.',
    39.99,
    mockProductCategories[4],
    180
  ),
  ProductFactory.create(
    '9',
    'Natural Skincare Set',
    'Complete skincare routine with natural ingredients for all skin types.',
    69.99,
    mockProductCategories[5],
    95
  ),
  ProductFactory.create(
    '10',
    'Portable Bluetooth Speaker',
    'Waterproof portable speaker with 360-degree sound and 12-hour battery life.',
    129.99,
    mockProductCategories[0],
    110
  )
]

// Enhance mock products with additional data
export const enhancedMockProducts = mockProducts.map((product, index) => {
  const enhancedProduct = { ...product }
  
  // Add images
  enhancedProduct.images = [
    `https://picsum.photos/400/400?random=${index + 1}`,
    `https://picsum.photos/400/400?random=${index + 11}`,
    `https://picsum.photos/400/400?random=${index + 21}`
  ]
  
  // Add tags
  enhancedProduct.tags = [
    ['wireless', 'bluetooth', 'audio', 'premium', 'noise-canceling'],
    ['fitness', 'smartwatch', 'health', 'tracking', 'gps'],
    ['organic', 'cotton', 'sustainable', 'comfortable', 'fashion'],
    ['designer', 'denim', 'premium', 'durable', 'fashion'],
    ['security', 'smart-home', 'camera', 'monitoring', 'hd'],
    ['garden', 'tools', 'outdoor', 'essential', 'durable'],
    ['books', 'novels', 'award-winning', 'hardcover', 'collection'],
    ['yoga', 'fitness', 'eco-friendly', 'non-slip', 'practice'],
    ['skincare', 'natural', 'routine', 'all-skin-types', 'organic'],
    ['portable', 'bluetooth', 'speaker', 'waterproof', '360-sound']
  ][index] || ['featured', 'popular']
  
  // Add ratings
  const baseRating = 4.0 + (Math.random() * 0.8)
  const ratingCount = Math.floor(Math.random() * 500) + 50
  enhancedProduct.rating = {
    average: Math.round(baseRating * 10) / 10,
    count: ratingCount,
    distribution: {
      1: Math.floor(ratingCount * 0.05),
      2: Math.floor(ratingCount * 0.08),
      3: Math.floor(ratingCount * 0.12),
      4: Math.floor(ratingCount * 0.35),
      5: Math.floor(ratingCount * 0.40)
    }
  }
  
  // Add metadata
  enhancedProduct.metadata = {
    brand: [
      'AudioTech Pro',
      'FitLife',
      'EcoWear',
      'DenimCraft',
      'SecureHome',
      'GardenMaster',
      'BookWorld',
      'YogaEssence',
      'NaturalGlow',
      'SoundWave'
    ][index] || 'Brand',
    weight: [
      '250g',
      '45g',
      '180g',
      '400g',
      '120g',
      '2.5kg',
      '800g',
      '1.2kg',
      '300g',
      '450g'
    ][index] || 'N/A',
    dimensions: [
      '18 x 18 x 8 cm',
      '4.2 x 4.2 x 1.2 cm',
      'M: 70 x 54 cm',
      '32 x 32 x 1.5 cm',
      '6 x 6 x 4 cm',
      'Various sizes',
      '15 x 23 x 3 cm',
      '183 x 61 x 0.6 cm',
      'Various sizes',
      '15 x 15 x 8 cm'
    ][index] || 'N/A',
    warranty: '2 years',
    shipping: 'Free shipping',
    returnPolicy: '30-day return policy'
  }
  
  // Add timestamps
  const baseDate = new Date('2024-01-01')
  enhancedProduct.createdAt = new Date(baseDate.getTime() + (index * 24 * 60 * 60 * 1000))
  enhancedProduct.updatedAt = new Date(enhancedProduct.createdAt.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000))
  
  return enhancedProduct
})

export const mockProductTags = [
  { tag: 'wireless', count: 3, color: 'primary' },
  { tag: 'bluetooth', count: 2, color: 'info' },
  { tag: 'fitness', count: 2, color: 'success' },
  { tag: 'organic', count: 2, color: 'warning' },
  { tag: 'premium', count: 4, color: 'danger' },
  { tag: 'smart', count: 3, color: 'secondary' },
  { tag: 'eco-friendly', count: 2, color: 'success' },
  { tag: 'portable', count: 2, color: 'info' }
]

export const mockProductPriceRanges = [
  { min: 0, max: 50, count: 3, label: '$0 - $50' },
  { min: 50, max: 100, count: 3, label: '$50 - $100' },
  { min: 100, max: 200, count: 2, label: '$100 - $200' },
  { min: 200, max: 300, count: 1, label: '$200 - $300' },
  { min: 300, max: 400, count: 1, label: '$300 - $400' }
]

export const mockProductRatings = [
  { rating: 1, count: 45, label: '1 Star' },
  { rating: 2, count: 72, label: '2 Stars' },
  { rating: 3, count: 108, label: '3 Stars' },
  { rating: 4, count: 315, label: '4 Stars' },
  { rating: 5, count: 360, label: '5 Stars' }
]
