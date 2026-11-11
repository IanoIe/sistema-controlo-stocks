import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/categoriesService';
import { Category } from '../../models/category';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  templateUrl: './categories.html'
})

export class Categories implements OnInit {
  // Stores the list of categories retrieved from the API.
  categories: Category[] = [];
  // Indicates whether the categories are currently being loaded.
  loading = true;
  // Stores an error message if the categories cannot be retrieved.
  error = '';
  // Stores the search term entered by the user.
  searchTerm = '';

  constructor(
    private categoriesService: CategoriesService
  ) {}

  /**
   * Initializes the component and retrieves all categories
   * from the categories service.
   * Updates the loading state and handles potential errors.
   */
  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories: Category[]) => {
        // Stores the categories retrieved from the API.
        this.categories = categories;
        // Indicates that the loading process has finished.
        this.loading = false;
        // Logs the retrieved categories for debugging purposes.
        console.log('Categories loaded successfully:', categories);
      },
      // Handles errors that occur while retrieving categories.
      error: (error: unknown) => {
        console.error('Failed to load categories:', error);
        // Displays an error message when the request fails.
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  /**
   * Filters the categories based on the search term entered by the user.
   * Performs a case-insensitive search using the category name.
   *
   * Returns only the categories whose names contain the search term.
   */
  get filteredCategories(): Category[] {
    // Removes leading and trailing whitespace and converts the search term to lowercase.
    const term = this.searchTerm.trim().toLowerCase();
    // Returns categories whose names match the search term.
    return this.categories.filter(category =>
      category.nameCategory.toLowerCase().includes(term)
    );
  }
}
