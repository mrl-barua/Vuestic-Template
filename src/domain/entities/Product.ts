export interface ProductId {
  value: string
}

export interface ProductName {
  value: string
  isValid(): boolean
}

export interface ProductPrice {
  amount: number
  currency: string
  isValid(): boolean
  format(): string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  parentId?: string
  isActive: boolean
}

export interface ProductInventory {
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  isLowStock(): boolean
  isOutOfStock(): boolean
}

export interface ProductRating {
  average: number
  count: number
  distribution: Record<number, number>
  isValid(): boolean
}

export interface Product {
  id: ProductId
  name: ProductName
  description: string
  price: ProductPrice
  category: ProductCategory
  inventory: ProductInventory
  rating: ProductRating
  images: string[]
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  metadata: Record<string, any>
}

// Value Objects
export class ProductIdValue implements ProductId {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Product ID cannot be empty')
    }
  }

  equals(other: ProductId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

export class ProductNameValue implements ProductName {
  constructor(public readonly value: string) {
    if (!this.isValid()) {
      throw new Error('Product name cannot be empty and must be between 2 and 100 characters')
    }
  }

  isValid(): boolean {
    return this.value.length >= 2 && this.value.length <= 100
  }

  getSlug(): string {
    return this.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  toString(): string {
    return this.value
  }
}

export class ProductPriceValue implements ProductPrice {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (!this.isValid()) {
      throw new Error('Product price must be a positive number')
    }
  }

  isValid(): boolean {
    return this.amount > 0 && Number.isFinite(this.amount)
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount)
  }

  add(other: ProductPrice): ProductPriceValue {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies')
    }
    return new ProductPriceValue(this.amount + other.amount, this.currency)
  }

  multiply(factor: number): ProductPriceValue {
    return new ProductPriceValue(this.amount * factor, this.currency)
  }
}

export class ProductInventoryValue implements ProductInventory {
  constructor(
    public readonly quantity: number,
    public readonly reserved: number = 0,
    public readonly lowStockThreshold: number = 5
  ) {
    if (quantity < 0 || reserved < 0 || lowStockThreshold < 0) {
      throw new Error('Inventory values cannot be negative')
    }
  }

  get available(): number {
    return Math.max(0, this.quantity - this.reserved)
  }

  isLowStock(): boolean {
    return this.available <= this.lowStockThreshold
  }

  isOutOfStock(): boolean {
    return this.available === 0
  }

  canReserve(amount: number): boolean {
    return amount > 0 && amount <= this.available
  }

  reserve(amount: number): ProductInventoryValue {
    if (!this.canReserve(amount)) {
      throw new Error('Cannot reserve requested amount')
    }
    return new ProductInventoryValue(
      this.quantity,
      this.reserved + amount,
      this.lowStockThreshold
    )
  }

  release(amount: number): ProductInventoryValue {
    if (amount > this.reserved) {
      throw new Error('Cannot release more than reserved')
    }
    return new ProductInventoryValue(
      this.quantity,
      this.reserved - amount,
      this.lowStockThreshold
    )
  }
}

export class ProductRatingValue implements ProductRating {
  constructor(
    public readonly average: number,
    public readonly count: number,
    public readonly distribution: Record<number, number> = {}
  ) {
    if (!this.isValid()) {
      throw new Error('Invalid rating values')
    }
  }

  isValid(): boolean {
    return (
      this.average >= 0 &&
      this.average <= 5 &&
      this.count >= 0 &&
      Number.isFinite(this.average) &&
      Number.isInteger(this.count)
    )
  }

  getRatingText(): string {
    if (this.average >= 4.5) return 'Excellent'
    if (this.average >= 4.0) return 'Very Good'
    if (this.average >= 3.5) return 'Good'
    if (this.average >= 3.0) return 'Fair'
    if (this.average >= 2.5) return 'Poor'
    return 'Very Poor'
  }

  addRating(rating: number): ProductRatingValue {
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error('Rating must be an integer between 1 and 5')
    }

    const newCount = this.count + 1
    const newAverage = (this.average * this.count + rating) / newCount
    
    const newDistribution = { ...this.distribution }
    newDistribution[rating] = (newDistribution[rating] || 0) + 1

    return new ProductRatingValue(newAverage, newCount, newDistribution)
  }
}

// Factory for creating Product entities
export class ProductFactory {
  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    category: ProductCategory,
    quantity: number = 0
  ): Product {
    return {
      id: new ProductIdValue(id),
      name: new ProductNameValue(name),
      description,
      price: new ProductPriceValue(price),
      category,
      inventory: new ProductInventoryValue(quantity),
      rating: new ProductRatingValue(0, 0),
      images: [],
      tags: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {}
    }
  }

  static fromData(data: any): Product {
    return {
      id: new ProductIdValue(data.id),
      name: new ProductNameValue(data.name),
      description: data.description,
      price: new ProductPriceValue(data.price.amount, data.price.currency),
      category: data.category,
      inventory: new ProductInventoryValue(
        data.inventory.quantity,
        data.inventory.reserved,
        data.inventory.lowStockThreshold
      ),
      rating: new ProductRatingValue(
        data.rating.average,
        data.rating.count,
        data.rating.distribution
      ),
      images: data.images || [],
      tags: data.tags || [],
      isActive: data.isActive,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      metadata: data.metadata || {}
    }
  }
}
