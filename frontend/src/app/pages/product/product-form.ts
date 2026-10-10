import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Sidebar } from "../../layout/sidebar/sidebar";
import { ProductService } from "../../service/productService";
import { Product } from "../../models/product";
import { Category } from "../../models/category";
import { CategoriesService } from "../../service/categoriesService";
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
  productId: number | null = null;
  isEditMode = false;
  loading = false;
  error = '';

  private returnTo: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (id !== null) {
      this.productId = Number(id);
      if (!Number.isInteger(this.productId) || this.productId <= 0) {
        this.error = 'Invalid product ID.';
        return;
      }
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('ERROR LOADING CATEGORIES:', error);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = '';
    this.productService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = {
          codeProduct: product.codeProduct,
          nameProduct: product.nameProduct,
          category: String(product.category?.id ?? ''),
          price: String(product.price),
          quantity: product.quantity,
          stockMin: product.stockMin
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR LOADING PRODUCT:', error);
        this.error = 'Unable to load product.';
        this.loading = false;
      }
    });
  }

  createproduct(): void {
    this.error = '';
    const productToSave: CreateProduct = {
      nameProduct: this.product.nameProduct,
      codeProduct: this.product.codeProduct,
      price: this.product.price,
      quantity: this.product.quantity,
      stockMin: this.product.stockMin,
      category: `/api/categories/${this.product.category}`
    };
    if (!this.product.category) {
      this.error = 'Please select a category.';
      return;
    }
    if (this.isEditMode && this.productId !== null) {
      this.productService
        .updateProduct(this.productId, productToSave)
        .subscribe({
          next: () => {
            this.goBackAfterSave();
          },
          error: (error) => {
            console.error('ERROR UPDATING PRODUCT:', error);
            this.error = 'Unable to update product.';
          }
        });
      return;
    }
    this.productService.createProduct(productToSave).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('ERROR CREATING PRODUCT:', error);
        this.error = 'Unable to create product.';
      }
    });
  }

  goBackAfterSave(): void {
    if (this.returnTo?.startsWith('/categories/')) {
      this.router.navigateByUrl(this.returnTo);
    } else {
      this.router.navigate(['/products']);
    }
  }
  cancel(): void {
    if (this.isEditMode) {
      this.goBackAfterSave();
    } else {
      this.router.navigate(['/products']);
    }
  }
}
