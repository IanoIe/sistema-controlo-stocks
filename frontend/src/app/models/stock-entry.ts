import { Product } from "./product";


export interface StockEntryModel {
  id: number;
  quantity: number;
  dateStockEntry: string;
  product: Product;
}

export interface StockEntryCollection {
  member: StockEntryModel[];
  totalItems: number;
}
