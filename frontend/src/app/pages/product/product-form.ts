import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Sidebar } from "../../layout/sidebar/sidebar";
import { ProductService } from "../../service/productService";
import { Router } from "@angular/router";

import { Category } from "../../models/category";
import { CategoryService } from "../../service/categoryService";
import { CreateProduct } from "../../models/create-product";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {

  product: CreateProduct = {
    codeProduct: '',
    nameProduct: '',
    category: '',
    price: '',
    quantity: 0,
    stockMin: 0
  };

  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('CATEGORIES RECEIVED:', categories);
        this.categories = categories;
      },
      error: (error) => {
        console.error('ERROR LOADING CATEGORIES:', error);
      }
    });
  }

  createproduct(): void {

    const productToCreate: CreateProduct = {
      nameProduct: this.product.nameProduct,
      codeProduct: this.product.codeProduct,
      price: this.product.price,
      quantity: this.product.quantity,
      stockMin: this.product.stockMin,
      category: `/api/categories/${this.product.category}`
    };

    console.log('PRODUCT TO CREATE:', productToCreate);

    this.productService.createProduct(productToCreate).subscribe({
      next: (response) => {
        console.log('PRODUCT CREATED:', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
  console.error('ERROR CREATING PRODUCT:', error);
  console.error('STATUS:', error.status);
  console.error('ERROR BODY:', error.error);
  console.error('ERROR DETAIL:', error.error?.detail);
}

    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
