import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";


@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './suppliers.html'
})

export class Suppliers {}
