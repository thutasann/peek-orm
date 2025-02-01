import { BigTable } from '../schemas/big_table.peek'

export const bigTablePayload: Omit<BigTable, 'id'>[] = [
  {
    name: 'Product 1',
    description: 'Description 1',
    is_active: true,
    is_deleted: false,
    price: 100,
    quantity: 10,
    category: 'Electronics',
    city: 'New York',
    country: 'USA',
  },
  {
    name: 'Product 2',
    description: 'Description 2',
    is_active: true,
    is_deleted: false,
    price: 200,
    quantity: 20,
    category: 'Clothing',
    city: 'London',
    country: 'UK',
  },
]
