import { Category } from './category';

export interface Product {
  id: number;
  '@id'?: string;
  nameProduct: string;
  codeProduct: string;
  price: string;
  quantity: number;
  stockMin: number;
  category: Category | null;
  active: boolean;
}
