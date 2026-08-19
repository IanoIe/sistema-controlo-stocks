import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../layout/sidebar/sidebar';

import { StockEntryModel } from '../../models/stock-entry';
import { StockEntryService } from '../../service/stockEntryService';

import { StockExitModel } from '../../models/stock-exit';
import { StockExitService } from '../../service/stockExitService';


@Component({
  selector: 'app-histories',
  standalone: true,

  imports: [
    CommonModule,
    Sidebar
  ],

  templateUrl: './histories.html'
})
export class Histories implements OnInit {

  // ==========================================
  // OPERATIONS
  // ==========================================

  stockEntries: StockEntryModel[] = [];

  stockExits: StockExitModel[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor(
    private stockEntryService: StockEntryService,
    private stockExitService: StockExitService
  ) {}


  // ==========================================
  // INIT
  // ==========================================
  ngOnInit(): void {

    this.loadStockEntries();

    this.loadStockExits();

  }


  // ==========================================
  // LOAD ENTRIES
  // ==========================================
  private loadStockEntries(): void {

    this.stockEntryService.getStockEntries().subscribe({

      next: (entries) => {

        this.stockEntries = entries;

        console.log(
          'HISTORY STOCK ENTRIES:',
          this.stockEntries
        );

      },

      error: (error) => {

        console.error(
          'ERROR LOADING STOCK ENTRIES:',
          error
        );

      }

    });

  }


  // ==========================================
  // LOAD EXITS
  // ==========================================
  private loadStockExits(): void {

    this.stockExitService.getStockExits().subscribe({

      next: (exits) => {

        this.stockExits = exits;

        console.log(
          'HISTORY STOCK EXITS:',
          this.stockExits
        );

      },

      error: (error) => {

        console.error(
          'ERROR LOADING STOCK EXITS:',
          error
        );

      }

    });

  }

}
