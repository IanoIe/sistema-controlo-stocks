import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../service/productService';
import { Product } from '../../models/product';
import { Sidebar } from '../../layout/sidebar/sidebar';
@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './category-products.html'
})

export class CategoryProducts implements OnInit {
  // Stores the list of products belonging to the selected category.
  products: Product[] = [];
  // Stores the ID of the currently selected category.
  categoryId = 0;
  // Indicates whether the products are currently being loaded.
  loading = true;
  // Stores an error message if the products cannot be retrieved.
  error = '';
  // Injects the Angular router to handle navigation between pages.
  private readonly router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  /**
   * Initializes the component and retrieves the category ID
   * from the current route parameters.
   * Validates the ID before loading the corresponding products.
   */
  ngOnInit(): void {
    // Retrieves and converts the category ID from the route parameters.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Validates that the category ID is a positive integer.
    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'Invalid category ID.';
      this.loading = false;
      // Logs the invalid category ID for debugging purposes.
      console.error('Invalid category ID:', id);
      return;
    }
    // Stores the validated category ID.
    this.categoryId = id;
    // Loads the products associated with the selected category.
    this.loadProducts();
  }

  /**
   * Retrieves all products associated with the selected category.
   * Updates the products list and loading state.
   * Handles any errors that occur during the request.
   */
  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProductsByCategory(this.categoryId)
      .subscribe({
        next: (products: Product[]) => {
          // Stores the products retrieved from the API.
          this.products = products;
          // Indicates that the loading process has finished.
          this.loading = false;
          // Logs the retrieved products for debugging purposes.
          console.log('Category products loaded successfully:', products);
        },
        // Handles errors that occur while retrieving category products.
        error: (error: unknown) => {
          console.error('Failed to load category products:', error);
          // Displays an error message when the request fails.
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
        }
      });
  }

  /**
   * Navigates back to the previous category-related page.
   * Checks the returnTo query parameter to restore the previous
   * category route when available.
   * Otherwise, redirects the user to the main categories page.
   */
  goBack(): void {
    // Retrieves the returnTo query parameter from the current route.
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    // Returns to the previous category-related route if valid.
    if (returnTo?.startsWith('/categories/')) {
      this.router.navigateByUrl(returnTo);
    // Redirects to the main categories page as a fallback.
    } else {
      this.router.navigate(['/categories']);
    }
  }
}
