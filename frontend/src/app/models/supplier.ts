export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxNumber: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierPayload {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxNumber: string | null;
  active: boolean;
}
