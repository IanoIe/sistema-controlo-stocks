import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { StockExitService } from '../../service/stockExitService';
import { StockExitModel } from '../../models/stock-exit';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-stock-exit',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './stock-exit.html'
})


export class StockExit implements OnInit {

  stockExits: StockExitModel[] = [];

  constructor(private stockExitService: StockExitService) {}

  ngOnInit(): void {
    this.stockExitService.getStockExits().subscribe({
      next: (stockExits) => {
        console.log('STOCK EXITS RECEIVED:', stockExits);
        this.stockExits = stockExits;
      },
      error: (error) => {
        console.error('ERROR LOADING STOCK EXITS:', error);
      }
    });
  }
}

