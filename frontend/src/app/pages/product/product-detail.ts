import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";
import { Product } from "../../models/product";
import { ProductService } from "../../service/productService";
import { ActivatedRoute, Route, Router } from "@angular/router";




@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './product-detail.html'
})

export class ProductDetail implements OnInit {

  product: Product | null = null;

  loading = true;
  error = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        console.error('PRODUCT ID NOT FOUND');
        this.loading = false;
        this.error = true;
        return;
      }

      const productId = Number(id);

      if (isNaN(productId)) {
        console.error('INVALID PRODUCT ID:', id);
        this.loading = false;
        this.error = true;
        return;
      }

      console.log('LOADING PRODUCT:', productId);
      this.productService.getProduct(productId).subscribe({
        next: (product) => {

        console.log('PRODUCT RECEIVED:', product);

        this.product = product;
        this.loading = false;

      },

      error: (error) => {
        console.error('ERROR LOADING PRODUCT:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }

  editProduct(): void {
    if (!this.product) {
      return;
    }
    this.router.navigate(['/products', this.product.id, 'edit']);
  }
  backToProducts(): void {
    this.router.navigate(['/products']);
  }
}
