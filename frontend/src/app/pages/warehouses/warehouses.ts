import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../service/WarehouseService';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './warehouses.html'
})
export class Warehouses implements OnInit {

  private readonly warehouseService = inject(WarehouseService);

  warehouses: Warehouse[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        console.log('Warehouses recebidos:', data);

        this.warehouses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);

        this.errorMessage =
          error.status === 401
            ? 'Authentication required. Please log in again.'
            : 'Unable to load warehouses. Please try again.';

        this.loading = false;
      }
    });
  }

  get filteredWarehouses(): Warehouse[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.warehouses;
    }

    return this.warehouses.filter(warehouse =>
      warehouse.name.toLowerCase().includes(term) ||
      warehouse.location.toLowerCase().includes(term)
    );
  }

  get totalWarehouses(): number {
    return this.warehouses.length;
  }

  get activeWarehouses(): number {
    return this.warehouses.filter(w => w.active).length;
  }

  get inactiveWarehouses(): number {
    return this.warehouses.filter(w => !w.active).length;
  }

  trackById(index: number, warehouse: Warehouse): number {
    return warehouse.id;
  }

  viewWarehouse(warehouse: Warehouse): void {
    console.log('View warehouse:', warehouse.id);
  }

  editWarehouse(warehouse: Warehouse): void {
    console.log('Edit warehouse:', warehouse.id);
  }

  addWarehouse(): void {
    console.log('Add warehouse');
  }
}
