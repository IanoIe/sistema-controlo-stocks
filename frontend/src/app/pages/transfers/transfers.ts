import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";


@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './transfers.html'
})

export class Transfers {}
