import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StockEntryService } from '../../service/stockEntryService';
import { ProductService } from '../../service/productService';

import { StockEntryModel } from '../../models/stock-entry';
import { Product } from '../../models/product';

import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-stock-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './stock-entry.html'
})
export class StockEntry implements OnInit {

  stockEntries: StockEntryModel[] = [];
  products: Product[] = [];

  showNewEntry = false;
  saving = false;
  loadingProducts = false;

  errorMessage = '';
  successMessage = '';

  formData = {
    productId: '',
    quantity: 1,
    dateStockEntry: this.getCurrentDate()
  };

  constructor(
    private stockEntryService: StockEntryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadStockEntries();
    this.loadProducts();
  }

  loadStockEntries(): void {
    this.stockEntryService.getStockEntries().subscribe({
      next: (entries) => {
        this.stockEntries = entries;
      },
      error: (error) => {
        console.error('ERROR LOADING STOCK ENTRIES:', error);
      }
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = Array.isArray(products) ? products : [];
        this.loadingProducts = false;

        console.log('PRODUCTS RECEIVED:', this.products);
      },
      error: (error) => {
        this.loadingProducts = false;
        console.error('ERROR LOADING PRODUCTS:', error);
        this.errorMessage = 'Could not load products.';
      }
    });
  }

  openNewEntry(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.formData = {
      productId: '',
      quantity: 1,
      dateStockEntry: this.getCurrentDate()
    };

    this.showNewEntry = true;
  }

  closeNewEntry(): void {
    this.showNewEntry = false;
    this.errorMessage = '';
  }

  saveEntry(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const productId = Number(this.formData.productId);
    const quantity = Number(this.formData.quantity);

    const selectedProduct = this.products.find(
      product => product.id === productId
    );

    if (!selectedProduct) {
      this.errorMessage = 'Please select a valid product.';
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      this.errorMessage = 'Quantity must be a positive integer.';
      return;
    }

    if (!this.formData.dateStockEntry) {
      this.errorMessage = 'Please select an entry date.';
      return;
    }

    // Use the IRI supplied by the API, if available.
    const productIri = (
      selectedProduct as Product & { '@id'?: string }
    )['@id'];

    if (!productIri) {
      this.errorMessage =
        'The product IRI was not returned by the API. Check the product response.';
      console.error('SELECTED PRODUCT:', selectedProduct);
      return;
    }

    const payload = {
      quantity,
      dateStockEntry: new Date(
        this.formData.dateStockEntry
      ).toISOString(),
      product: productIri
    };

    this.saving = true;

    this.stockEntryService.createStockEntry(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showNewEntry = false;
        this.successMessage =
          'Stock entry created successfully!';

        this.loadStockEntries();
      },
      error: (error) => {
        this.saving = false;

        console.error('STATUS:', error.status);
        console.error('ERROR BODY:', error.error);

        this.errorMessage =
          error.error?.detail ||
          error.error?.['hydra:description'] ||
          'Could not create stock entry.';
      }
    });
  }

  private getCurrentDate(): string {
    const now = new Date();
    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 16);
  }
}
