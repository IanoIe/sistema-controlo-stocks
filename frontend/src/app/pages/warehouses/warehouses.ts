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
  appliedSearchTerm = '';

  loading = false;
  errorMessage = '';

  showAddWarehouseModal = false;
  showViewWarehouseModal = false;
  showEditWarehouseModal = false;

  newWarehouse = {
    name: '',
    location: '',
    active: true
  };

  selectedWarehouse: Warehouse | null = null;

  editWarehouseData = {
    name: '',
    location: '',
    active: true
  };

  ngOnInit(): void {
    this.loadWarehouses();
  }

  // SEARCH
  searchWarehouses(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
  }

  // LOAD WAREHOUSES
  loadWarehouses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.warehouseService.getWarehouses().subscribe({
      next: (response: any) => {
        console.log('Warehouses recebidos:', response);
        // API Platform pode devolver uma coleção Hydra.
        const items = Array.isArray(response)
          ? response
          : response?.member;

        if (!Array.isArray(items)) {
          console.error('Formato inesperado da resposta:', response);
          this.warehouses = [];
          this.errorMessage = 'The API response does not contain a valid list of warehouses.';
          this.loading = false;
          return;
        }
        this.warehouses = items;
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

  // FILTERED LIST
  get filteredWarehouses(): Warehouse[] {
    const term = this.appliedSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.warehouses;
    }
    return this.warehouses.filter(warehouse =>
      (warehouse.name ?? '').toLowerCase().startsWith(term)
    );
  }

  // STATISTICS
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

  // CREATE WAREHOUSE
  createWarehouse(): void {
    const name = this.newWarehouse.name.trim();
    const location = this.newWarehouse.location.trim();
    if (!name || !location) {
      this.errorMessage = 'Name and location are required.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.warehouseService.createWarehouse({
      name,
      location,
      active: this.newWarehouse.active
    }).subscribe({
      next: (warehouse) => {
        console.log('Warehouse criado:', warehouse);
        this.showAddWarehouseModal = false;
        this.newWarehouse = {
          name: '',
          location: '',
          active: true
        };
        this.loadWarehouses();
      },
      error: (error) => {
        console.error('Erro ao criar warehouse:', error);
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to create warehouse.';
        this.loading = false;
      }
    });
  }

  // VIEW WAREHOUSE
  viewWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.showViewWarehouseModal = true;
  }

  closeViewWarehouse(): void {
    this.showViewWarehouseModal = false;
    this.selectedWarehouse = null;
  }

  // ADD WAREHOUSE MODAL
  addWarehouse(): void {
    this.newWarehouse = {
      name: '',
      location: '',
      active: true
    };
    this.errorMessage = '';
    this.showAddWarehouseModal = true;
  }

  closeAddWarehouse(): void {
    this.showAddWarehouseModal = false;
  }

  // EDIT WAREHOUSE
  editWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.editWarehouseData = {
      name: warehouse.name,
      location: warehouse.location,
      active: warehouse.active
    };

    this.errorMessage = '';
    this.showEditWarehouseModal = true;
  }

  closeEditWarehouse(): void {
    this.showEditWarehouseModal = false;
    this.selectedWarehouse = null;
  }

  saveWarehouseChanges(): void {
    if (!this.selectedWarehouse) {
      this.errorMessage = 'No warehouse selected.';
      return;
    }

    const id = this.selectedWarehouse.id;
    const payload = {
      name: this.editWarehouseData.name.trim(),
      location: this.editWarehouseData.location.trim(),
      active: this.editWarehouseData.active
    };

    if (!payload.name || !payload.location) {
      this.errorMessage = 'Name and location are required.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.warehouseService.updateWarehouse(id, payload).subscribe({
      next: (updatedWarehouse) => {
        console.log('Warehouse updated:', updatedWarehouse);
        this.warehouses = this.warehouses.map(warehouse =>
          warehouse.id === id
            ? { ...warehouse, ...updatedWarehouse }
            : warehouse
        );
        this.showEditWarehouseModal = false;
        this.selectedWarehouse = null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating warehouse:', error);
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to update warehouse.';
        this.loading = false;
      }
    });
  }
}
