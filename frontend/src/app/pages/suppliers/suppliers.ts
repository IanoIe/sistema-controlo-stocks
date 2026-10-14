import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../layout/sidebar/sidebar';
import { Supplier, SupplierPayload } from '../../models/supplier';
import { SupplierService } from '../../service/supplierService';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './suppliers.html'
})
export class Suppliers implements OnInit {
  private readonly supplierService = inject(SupplierService);

  suppliers: Supplier[] = [];

  searchTerm = '';
  appliedSearchTerm = '';

  loading = false;
  errorMessage = '';

  showAddSupplierModal = false;
  showViewSupplierModal = false;
  showEditSupplierModal = false;

  selectedSupplier: Supplier | null = null;

  newSupplier: SupplierPayload = this.emptySupplier();

  editSupplierData: SupplierPayload = this.emptySupplier();

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private emptySupplier(): SupplierPayload {
    return {
      name: '',
      email: null,
      phone: null,
      address: null,
      taxNumber: null,
      active: true
    };
  }

  // LOAD SUPPLIERS
  loadSuppliers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        console.log('Suppliers received:', suppliers);
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);

        this.errorMessage =
          error.status === 401
            ? 'Authentication required. Please log in again.'
            : 'Unable to load suppliers. Please try again.';

        this.loading = false;
      }
    });
  }

  // SEARCH
  searchSuppliers(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
  }


  clearSearch(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
  }

  get filteredSuppliers(): Supplier[] {
    const term = this.appliedSearchTerm.toLowerCase();

    if (!term) {
      return this.suppliers;
    }

    return this.suppliers.filter(supplier =>
      (supplier.name ?? '').toLowerCase().includes(term)
    );
  }

  // STATISTICS
  get totalSuppliers(): number {
    return this.suppliers.length;
  }

  get activeSuppliers(): number {
    return this.suppliers.filter(supplier => supplier.active).length;
  }

  get inactiveSuppliers(): number {
    return this.suppliers.filter(supplier => !supplier.active).length;
  }

  trackById(index: number, supplier: Supplier): number {
    return supplier.id;
  }

  // ADD SUPPLIER
  addSupplier(): void {
    this.newSupplier = this.emptySupplier();
    this.errorMessage = '';
    this.showAddSupplierModal = true;
  }

  closeAddSupplier(): void {
    this.showAddSupplierModal = false;
  }

  createSupplier(): void {
    const payload = this.normalizePayload(this.newSupplier);

    if (!payload.name) {
      this.errorMessage = 'Supplier name is required.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.supplierService.createSupplier(payload).subscribe({
      next: (supplier) => {
        this.suppliers = [...this.suppliers, supplier];
        this.showAddSupplierModal = false;
        this.newSupplier = this.emptySupplier();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating supplier:', error);

        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to create supplier.';

        this.loading = false;
      }
    });
  }

  // VIEW SUPPLIER
  viewSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.showViewSupplierModal = true;
  }

  editSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.editSupplierData = {
      name: supplier.name ?? '',
      email: supplier.email ?? null,
      phone: supplier.phone ?? null,
      address: supplier.address ?? null,
      taxNumber: supplier.taxNumber ?? null,
      active: supplier.active
    };
    this.errorMessage = '';
    this.showViewSupplierModal = false;
    this.showEditSupplierModal = true;
  }
  
  closeViewSupplier(): void {
    this.showViewSupplierModal = false;
    this.selectedSupplier = null;
  }


  closeEditSupplier(): void {
    this.showEditSupplierModal = false;
    this.selectedSupplier = null;
  }

  saveSupplierChanges(): void {
    if (!this.selectedSupplier) {
      this.errorMessage = 'No supplier selected.';
      return;
    }

    const id = this.selectedSupplier.id;
    const payload = this.normalizePayload(this.editSupplierData);

    if (!payload.name) {
      this.errorMessage = 'Supplier name is required.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.supplierService.updateSupplier(id, payload).subscribe({
      next: (updatedSupplier) => {
        this.suppliers = this.suppliers.map(supplier =>
          supplier.id === id
            ? { ...supplier, ...updatedSupplier }
            : supplier
        );

        this.showEditSupplierModal = false;
        this.selectedSupplier = null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating supplier:', error);

        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to update supplier.';

        this.loading = false;
      }
    });
  }

  private normalizePayload(data: SupplierPayload): SupplierPayload {
    return {
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      address: data.address?.trim() || null,
      taxNumber: data.taxNumber?.trim() || null,
      active: data.active
    };
  }
}
