import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { StockTransferService } from '../../service/StockTransferService';
import { StockTransfer } from '../../models/StockTransfer';
import { WarehouseService } from '../../service/WarehouseService';
import { Warehouse } from '../../models/Warehouse';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './transfers.html'
})
export class Transfers implements OnInit {
  private readonly transferService = inject(StockTransferService);

  private readonly warehouseService = inject(WarehouseService);

  warehouse: Warehouse[] = [];
  private warehouseNames = new Map<string, string>();

  transfers: StockTransfer[] = [];

  loading = false;
  errorMessage = '';

  searchTerm = '';
  selectedStatus = 'ALL';

  readonly statuses: {
    value: string;
    label: string;
  }[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.loadTransfers();
    this.loadWarehouses();
  }

  loadTransfers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.transferService.getStockTransfers().subscribe({
      next: (data) => {
        this.transfers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stock transfers:', error);
        this.errorMessage = 'Unable to load stock transfers.';
        this.loading = false;
      }
    });
  }

  loadWarehouses(): void {
  this.warehouseService.getWarehouses().subscribe({
    next: (data) => {
      this.warehouse = data;
      this.warehouseNames.clear();

      for (const warehouse of data) {
        this.warehouseNames.set(
          `/api/warehouses/${warehouse.id}`,
          warehouse.name
        );
      }
    },
    error: (error) => {
      console.error('Error loading warehouses:', error);
    }
  });
}

getWarehouseName(iri: string): string {
  return this.warehouseNames.get(iri) ?? iri;
}

  get filteredTransfers(): StockTransfer[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.transfers.filter((transfer) => {
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        transfer.status === this.selectedStatus;

      const matchesSearch =
        !term ||
        String(transfer.id).includes(term) ||
        (transfer.notes ?? '').toLowerCase().includes(term) ||
        transfer.sourceWarehouse.toLowerCase().includes(term) ||
        transfer.destinationWarehouse.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }

  get totalTransfers(): number {
    return this.transfers.length;
  }

  get pendingTransfers(): number {
    return this.transfers.filter(
      transfer => transfer.status === 'PENDING'
    ).length;
  }

  get completedTransfers(): number {
    return this.transfers.filter(
      transfer => transfer.status === 'COMPLETED'
    ).length;
  }

  get cancelledTransfers(): number {
    return this.transfers.filter(
      transfer => transfer.status === 'CANCELLED'
    ).length;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pending',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled'
    };

    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20'
    };

    return classes[status] ??
      'bg-gray-100 text-gray-700 ring-gray-500/20';
  }

  trackById(index: number, transfer: StockTransfer): number {
    return transfer.id;
  }
}
