import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StockExitService } from '../../service/stockExitService';
import { ProductService } from '../../service/productService';

import { StockExitModel } from '../../models/stock-exit';
import { Product } from '../../models/product';

import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-stock-exit',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './stock-exit.html'
})
export class StockExit implements OnInit {

  stockExits: StockExitModel[] = [];
  products: Product[] = [];

  showNewExit = false;
  saving = false;
  loadingProducts = false;

  errorMessage = '';
  successMessage = '';

  formData = {
    productId: '',
    quantity: 1,
    dateStockExit: this.getCurrentDate()
  };

  constructor(
    private stockExitService: StockExitService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadStockExits();
    this.loadProducts();
  }

  // Load stock exits
  loadStockExits(): void {
    this.stockExitService.getStockExits().subscribe({
      next: (exits) => {
        this.stockExits = exits;
        console.log('STOCK EXITS RECEIVED:', exits);
      },
      error: (error) => {
        console.error('ERROR LOADING STOCK EXITS:', error);
        this.errorMessage = 'Could not load stock exits.';
      }
    });
  }

  // Load products for the form
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

  // Open form
  openNewExit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.formData = {
      productId: '',
      quantity: 1,
      dateStockExit: this.getCurrentDate()
    };
    this.showNewExit = true;
  }

  // Close form
  closeNewExit(): void {
    this.showNewExit = false;
    this.errorMessage = '';
  }

  // Create stock exit
  saveExit(): void {
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

    if (!this.formData.dateStockExit) {
      this.errorMessage = 'Please select a date.';
      return;
    }

    // Obtain the IRI returned by API Platform
    const productIri = (
      selectedProduct as Product & { '@id'?: string }
    )['@id'];

    if (!productIri) {
      this.errorMessage = 'Product IRI is missing. Check the GET /products response.';
      console.error('SELECTED PRODUCT:', selectedProduct);
      return;
    }

    const payload = {
      quantity,
      dateStockExit: new Date(
        this.formData.dateStockExit
      ).toISOString(),
      product: productIri
    };
    this.saving = true;
    this.stockExitService.createStockExit(payload).subscribe({
      next: (result) => {
        console.log('STOCK EXIT CREATED:', result);
        this.saving = false;
        this.showNewExit = false;
        this.successMessage = 'Stock exit created successfully!';
        this.loadStockExits();
      },
      error: (error) => {
        this.saving = false;
        console.error('ERROR CREATING STOCK EXIT:', error.status);
        console.error('ERROR BODY:', error.error);
        this.errorMessage = error.error?.detail || error.error?.['hydra:description'] ||
          'Could not create stock exit. Check the data and try again.';
      }
    });
  }

  // Current local date
  private getCurrentDate(): string {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }
}
