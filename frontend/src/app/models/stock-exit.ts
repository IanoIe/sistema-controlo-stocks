import { Product } from "./product";


export interface StockExitModel {
  id: number;
  quantity: number;
  dateStockExit: string;
  product: Product;
}

export interface StockExitCollection {
  member: StockExitModel[];
  totalItems: number;
}
