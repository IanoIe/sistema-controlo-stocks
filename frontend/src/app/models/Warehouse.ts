export interface Warehouse {
  id: number;
  name: string;
  location: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehousePayload {
  name: string;
  location: string;
  active: boolean;
}
