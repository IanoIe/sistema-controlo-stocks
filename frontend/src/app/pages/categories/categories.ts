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
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Sidebar
  ],
  templateUrl: './categories.html'
})
export class Categories implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.loading = false;
        console.log('Categories loaded successfully:', categories);
      },
      error: (error: unknown) => {
        console.error('Failed to load categories:', error);
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  get filteredCategories(): Category[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.categories.filter(category =>
      category.nameCategory.toLowerCase().includes(term)
    );
  }
}
