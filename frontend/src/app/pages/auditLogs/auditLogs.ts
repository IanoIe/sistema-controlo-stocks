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
  // Injects the audit log service to retrieve audit records.
  private readonly auditLogService = inject(AuditLogService);
  // Stores the list of audit log records.
  auditLogs: AuditLog[] = [];
  // Indicates whether audit records are currently being loaded.
  loading = false;
  // Stores an error message if the audit records cannot be retrieved.
  errorMessage = '';
  // Stores the ID of the currently expanded audit log entry.
  expandedLogId: number | null = null;

  /**
   * Initializes the component and loads all audit log records.
   */
  ngOnInit(): void {
    this.loadAuditLogs();
  }

  /**
   * Retrieves all audit log records from the audit log service.
   * Updates the loading state and stores the retrieved records.
   * Handles any errors that occur during the request.
   */
  loadAuditLogs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.auditLogService.getAll().subscribe({
      next: (response) => {
        // Logs the complete API response for debugging purposes.
        console.log('Full response:', response);
        console.log('First record:', response.member?.[0]);
        // Stores the retrieved audit records.
        // Uses an empty array if no records are returned.
        this.auditLogs = response.member ?? [];
        // Indicates that the loading process has finished.
        this.loading = false;
      },
      // Handles errors that occur while retrieving audit records.
      error: (error) => {
        console.error(error);
        // Displays an error message when the request fails.
        this.errorMessage = 'Failed to load audit records.';
        this.loading = false;
      }
    });
  }

  /**
   * Compares the previous and current entity data to identify
   * which fields were modified during an audit operation.
   *
   * Returns an array containing the names of the changed fields.
   */
  getChangedFields(log: AuditLog): string[] {
    // Parses the previous and current audit data.
    const oldData = this.parseAuditData(log.oldData);
    const newData = this.parseAuditData(log.newData);
    // Returns an empty array if neither version contains valid data.
    if (oldData === null && newData === null) {
      return [];
    }
    // Uses empty objects when either version of the data is unavailable.
    const previous = oldData ?? {};
    const current = newData ?? {};
    // Creates a set containing all field names from both data versions.
    const fields = new Set([...Object.keys(previous), ...Object.keys(current)]);
    // Compares the previous and current values of each field
    // and returns only the fields whose values have changed.
    return [...fields].filter(
      field => JSON.stringify(previous[field]) !== JSON.stringify(current[field])
    );
  }

  /**
   * Parses audit data into a structured object.
   * Handles JSON strings and validates the resulting data.
   *
   * Returns null if the data is empty, invalid or not a valid object.
   */
  private parseAuditData(data: unknown): Record<string, unknown> | null {
    // Returns null when no data is available.
    if (data == null || data === '') {
      return null;
    }
    let parsed: unknown = data;
    // Attempts to parse the data if it is provided as a JSON string.
    if (typeof data === 'string') {
      try {
        parsed = JSON.parse(data);
      } catch {
        // Returns null if the JSON string cannot be parsed.
        return null;
      }
    }
    // Ensures the parsed value is an object and not an array.
    if (typeof parsed !== 'object' || Array.isArray(parsed))
    {
      return null;
    }
    // Returns the validated data as a key-value object.
    return parsed as Record<string, unknown>;
  }

  /**
   * Converts an audit action code into a human-readable label.
   * Returns the original action if no matching label is found.
   */
  getActionLabel(action: string): string {
    // Maps audit action codes to their corresponding display labels.
    const labels: Record<string, string> = {
      CREATE: 'Creation',
      UPDATE: 'Update',
      DELETE: 'Deletion'
    };
    // Normalizes the action code before retrieving its label.
    return labels[action.toUpperCase()] ?? action;
  }

  /**
   * Formats a date string according to the Portuguese locale.
   * Returns the original value if the date is invalid.
   */
  formatDate(date: string): string {
    const parsedDate = new Date(date);
    // Returns the original date if parsing fails.
    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }
    // Formats the date and time using the Portuguese locale.
    return parsedDate.toLocaleString('pt-PT');
  }

  /**
   * Toggles the visibility of the details of an audit log entry.
   * Expands the selected entry or collapses it if it is already open.
   */
  toggleDetails(id: number): void {
    // Collapses the current entry if it is already expanded.
    // Otherwise, expands the selected audit log entry.
    this.expandedLogId = this.expandedLogId === id ? null : id;
  }
}
