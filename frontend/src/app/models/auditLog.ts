export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: string;
  user: {
    id?: number;
    email?: string;
  } | null;
}
