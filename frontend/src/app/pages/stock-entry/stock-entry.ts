import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { StockEntryService } from '../../service/stockEntryService';
import { StockEntryModel } from '../../models/stock-entry';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-stock-entry',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './stock-entry.html'
})

export class StockEntry implements OnInit {

  stockEntries: StockEntryModel[] = [];

  constructor(private stockEntryService: StockEntryService) {}

  ngOnInit(): void {

    this.stockEntryService.getStockEntries().subscribe({

      next: (stockEntries) => {
        console.log('STOCK ENTRIES RECEIVED:', stockEntries);

        this.stockEntries = stockEntries;
      },

      error: (error) => {
        console.error('ERROR LOADING STOCK ENTRIES:', error);
      }

    });
  }
}
