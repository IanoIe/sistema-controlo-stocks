import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';
import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';

/**
 * Component responsible for displaying the history of stock operations.
 * Retrieves and manages stock entry and stock exit records
 * to provide an overview of all inventory movements.
 */
@Component({
  selector: 'app-histories',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './histories.html'
})

export class Histories implements OnInit {
  // ==========================================
  // OPERATIONS
  // ==========================================
  // Stores all registered stock entry records.
  stockEntries: StockEntryModel[] = [];

  // Stores all registered stock exit records.
  stockExits: StockExitModel[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the services required to retrieve
   * stock entry and stock exit information.
   */
  constructor(
    private stockEntryService: StockEntryService,
    private stockExitService: StockExitService
  ) {}

  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the histories component.
   * Loads all stock entry and stock exit records
   * when the component is created.
   */
  ngOnInit(): void {
    this.loadStockEntries();
    this.loadStockExits();
  }

  // ==========================================
  // LOAD STOCK ENTRIES
  // ==========================================

  /**
   * Retrieves all stock entry records from the stock entry service.
   * Updates the stock entries list when the request is successful.
   * Logs an error if the records cannot be retrieved.
   */
  private loadStockEntries(): void {
    this.stockEntryService.getStockEntries().subscribe({

      // Handles the successful response from the service.
      next: (entries) => {

        // Updates the list with the retrieved stock entry records.
        this.stockEntries = entries;

        // Logs the retrieved stock entries for debugging purposes.
        console.log(
          'HISTORY STOCK ENTRIES:',
          this.stockEntries
        );
      },

      // Handles errors that occur while retrieving stock entries.
      error: (error) => {

        console.error(
          'ERROR LOADING STOCK ENTRIES:',
          error
        );
      }

    });
  }

  // ==========================================
  // LOAD STOCK EXITS
  // ==========================================

  /**
   * Retrieves all stock exit records from the stock exit service.
   * Updates the stock exits list when the request is successful.
   * Logs an error if the records cannot be retrieved.
   */
  private loadStockExits(): void {
    this.stockExitService.getStockExits().subscribe({

      // Handles the successful response from the service.
      next: (exits) => {

        // Updates the list with the retrieved stock exit records.
        this.stockExits = exits;

        // Logs the retrieved stock exits for debugging purposes.
        console.log(
          'HISTORY STOCK EXITS:',
          this.stockExits
        );
      },
      // Handles errors that occur while retrieving stock exits.
      error: (error) => {
        console.error(
          'ERROR LOADING STOCK EXITS:',
          error
        );
      }

    });
  }

}
