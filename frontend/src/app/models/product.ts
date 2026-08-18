import { Category } from './category';

export interface Product {
  id: number;
  nameProduct: string;
  codeProduct: string;
  price: string;
  quantity: number;
  stockMin: number;
  category: Category | null;
}
