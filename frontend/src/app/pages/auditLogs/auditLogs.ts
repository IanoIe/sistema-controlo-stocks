import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { Sidebar } from '../../layout/sidebar/sidebar';
import { AuditLog } from '../../models/auditLog';
import { AuditLogService } from '../../service/auditLogService';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './auditLogs.html'
})

export class AuditLogs implements OnInit {
  private readonly auditLogService = inject(AuditLogService);
  auditLogs: AuditLog[] = []; loading = false; errorMessage = '';

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.auditLogService.getAll().subscribe({
      next: (response) => {
        console.log('Full response:', response);
        console.log('First record:', response.member?.[0]);
        this.auditLogs = response.member ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load audit records.';
        this.loading = false;
      }
    });
  }

  getChangedFields(log: AuditLog): string[] {
    const oldData = this.parseAuditData(log.oldData);
    const newData = this.parseAuditData(log.newData);
    if (oldData === null && newData === null) {
      return [];
    }

    const previous = oldData ?? {};
    const current = newData ?? {};
    const fields = new Set([...Object.keys(previous), ...Object.keys(current)]);

    return [...fields].filter(field => JSON.stringify(previous[field]) !== JSON.stringify(current[field]));
  }

  private parseAuditData(data: unknown): Record<string, unknown> | null {
    if (data == null || data === '') {
      return null;
    }
    let parsed: unknown = data;
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
      } catch {
        return null;
      }
    }
    if (typeof parsed !== 'object' || Array.isArray(parsed))
    {
      return null;
    }
    return parsed as Record<string, unknown>;
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      CREATE: 'Creation',
      UPDATE: 'Update',
      DELETE: 'Deletion'
    };
    return labels[action.toUpperCase()] ?? action;
  }

  formatDate(date: string): string { const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
       return date;
    }
    return parsedDate.toLocaleString('pt-PT');
  }

  expandedLogId: number | null = null;
  toggleDetails(id: number): void {
    this.expandedLogId = this.expandedLogId === id ? null : id;
  }
}
