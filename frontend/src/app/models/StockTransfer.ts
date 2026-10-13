export interface StockTransfer {
  id: number;
  transferDate: string;
  status: string;
  notes: string | null;
  sourceWarehouse: string;
  destinationWarehouse: string;
  user?: string;
  stockTransferItems: StockTransferItem[];
}

export interface StockTransferItem {
  id: number;
  quantity: number;
  product: string;
}

export interface StockTransferItemPayload {
  quantity: number;
  product: string;
}

export interface StockTransferPayload {
  transferDate?: string;
  status: string;
  notes?: string | null;
  sourceWarehouse: string;
  destinationWarehouse: string;
  stockTransferItems: StockTransferItemPayload[];
}
