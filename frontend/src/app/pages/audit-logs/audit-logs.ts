import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Sidebar } from "../../layout/sidebar/sidebar";


@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './audit-logs.html'
})

export class AuditLogs {}
