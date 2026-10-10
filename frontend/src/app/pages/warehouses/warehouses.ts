import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";


@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './warehouses.html'
})

export class Warehouses {}
