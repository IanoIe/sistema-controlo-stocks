import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { StockTransferService } from '../../service/StockTransferService';
import { StockTransfer } from '../../models/StockTransfer';
import { WarehouseService } from '../../service/WarehouseService';
import { Warehouse } from '../../models/Warehouse';

/**
 * Transfers component responsible for managing and displaying stock transfers.
 *
 * Retrieves stock transfer records and warehouse information from the backend.
 * Allows users to search and filter transfers by their status or related information.
 *
 * Provides summary statistics and a modal for viewing individual transfer details.
 */
@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './transfers.html'
})
export class Transfers implements OnInit {

  // ==========================================
  // DEPENDENCIES
  // ==========================================

  // Injects the service responsible for retrieving and managing stock transfers.
  private readonly transferService = inject(StockTransferService);

  // Injects the service responsible for retrieving warehouse information.
  private readonly warehouseService = inject(WarehouseService);


  // ==========================================
  // WAREHOUSE DATA
  // ==========================================

  // Stores all warehouses retrieved from the backend API.
  warehouse: Warehouse[] = [];

  // Maps warehouse API IRIs to their corresponding names.
  // Used to display readable warehouse names instead of API references.
  private warehouseNames = new Map<string, string>();


  // ==========================================
  // STOCK TRANSFER DATA
  // ==========================================

  // Stores all stock transfer records retrieved from the backend.
  transfers: StockTransfer[] = [];


  // ==========================================
  // COMPONENT STATES
  // ==========================================

  // Indicates whether stock transfer data is currently being loaded.
  loading = false;

  // Stores error messages displayed when an operation fails.
  errorMessage = '';

  // Stores the search term entered by the user.
  searchTerm = '';

  // Stores the currently selected transfer status filter.
  // Defaults to ALL to display transfers regardless of their status.
  selectedStatus = 'ALL';


  // ==========================================
  // TRANSFER DETAILS MODAL
  // ==========================================

  // Stores the transfer currently selected for detailed inspection.
  // Remains null when no transfer is selected.
  selectedTransfer: StockTransfer | null = null;

  // Controls the visibility of the transfer details modal.
  showDetailsModal = false;


  // ==========================================
  // AVAILABLE TRANSFER STATUSES
  // ==========================================

  // Defines the transfer statuses available for filtering.
  // Each status contains its backend value and corresponding display label.
  readonly statuses: {
    value: string;
    label: string;
  }[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];


  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the transfers component.
   *
   * Retrieves the existing stock transfers and warehouse information
   * required to display and manage the transfer records.
   */
  ngOnInit(): void {

    // Load all registered stock transfers.
    this.loadTransfers();

    // Load warehouse information for displaying readable warehouse names.
    this.loadWarehouses();
  }


  // ==========================================
  // LOAD STOCK TRANSFERS
  // ==========================================

  /**
   * Retrieves all stock transfer records from the backend.
   *
   * Updates the component state with the returned transfers
   * and manages the loading and error states during the request.
   */
  loadTransfers(): void {

    // Activates the loading indicator before requesting the data.
    this.loading = true;

    // Clears any previous error message.
    this.errorMessage = '';

    // Requests all stock transfers from the backend API.
    this.transferService.getStockTransfers().subscribe({

      // Handles the successful response from the backend.
      next: (data: StockTransfer[]) => {

        // Stores the retrieved stock transfers.
        this.transfers = data;

        // Deactivates the loading indicator after receiving the data.
        this.loading = false;
      },

      // Handles errors returned while retrieving stock transfers.
      error: (error) => {

        // Logs the error for debugging purposes.
        console.error('Error loading stock transfers:', error);

        // Displays an error message to the user.
        this.errorMessage = 'Unable to load stock transfers.';

        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }


  // ==========================================
  // LOAD WAREHOUSES
  // ==========================================

  /**
   * Retrieves all warehouses registered in the backend.
   *
   * Updates the warehouse collection and creates a mapping
   * between warehouse API IRIs and their corresponding names.
   *
   * This mapping allows warehouse references in stock transfers
   * to be displayed using readable warehouse names.
   */
  loadWarehouses(): void {

    // Requests all registered warehouses from the backend API.
    this.warehouseService.getWarehouses().subscribe({

      // Handles the successful warehouse retrieval response.
      next: (data: Warehouse[]) => {

        // Stores the retrieved warehouses.
        this.warehouse = data;

        // Clears the existing warehouse name mapping.
        this.warehouseNames.clear();

        // Creates a mapping between each warehouse API IRI and its name.
        for (const warehouse of data) {

          // Associates the warehouse API reference with its readable name.
          this.warehouseNames.set(
            `/api/warehouses/${warehouse.id}`,
            warehouse.name
          );
        }
      },

      // Handles errors returned while retrieving warehouses.
      error: (error) => {

        // Logs the error for debugging purposes.
        console.error('Error loading warehouses:', error);
      }
    });
  }


  // ==========================================
  // GET WAREHOUSE NAME
  // ==========================================

  /**
   * Retrieves the readable name associated with a warehouse API IRI.
   *
   * Searches the warehouse name mapping for the supplied reference.
   * Returns the original IRI when no matching warehouse name is found.
   *
   * @param iri - The API reference identifying the warehouse.
   * @returns The warehouse name or the original API IRI.
   */
  getWarehouseName(iri: string): string {

    // Return the warehouse name when a matching reference exists.
    // Otherwise, return the original IRI as a fallback.
    return this.warehouseNames.get(iri) ?? iri;
  }


  // ==========================================
  // FILTER STOCK TRANSFERS
  // ==========================================

  /**
   * Returns stock transfers filtered by the search term and selected status.
   *
   * Supports searching by transfer ID, notes, warehouse references,
   * warehouse names and transfer status labels.
   *
   * Applies both filters simultaneously when they are provided.
   *
   * @returns The list of stock transfers matching the active filters.
   */
  get filteredTransfers(): StockTransfer[] {

    // Normalize the search term by removing surrounding spaces
    // and converting all characters to lowercase.
    const term = this.searchTerm.trim().toLowerCase();

    // Filter the stock transfer collection using the active criteria.
    return this.transfers.filter((transfer) => {

      // Check whether the transfer matches the selected status.
      // The ALL option allows transfers with any status.
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        transfer.status === this.selectedStatus;

      // Check whether the transfer matches the search term.
      // Searches across IDs, notes, warehouse references,
      // warehouse names and readable status labels.
      const matchesSearch =
        !term ||
        String(transfer.id).includes(term) ||
        (transfer.notes ?? '').toLowerCase().includes(term) ||
        transfer.sourceWarehouse.toLowerCase().includes(term) ||
        transfer.destinationWarehouse.toLowerCase().includes(term) ||
        this.getWarehouseName(transfer.sourceWarehouse).toLowerCase().includes(term) ||
        this.getWarehouseName(transfer.destinationWarehouse).toLowerCase().includes(term) ||
        this.getStatusLabel(transfer.status).toLowerCase().includes(term);

      // Include the transfer only when it matches both filter conditions.
      return matchesStatus && matchesSearch;
    });
  }


  // ==========================================
  // TRANSFER SUMMARY STATISTICS
  // ==========================================

  /**
   * Returns the total number of registered stock transfers.
   *
   * @returns The total number of transfers.
   */
  get totalTransfers(): number {

    // Return the number of records in the transfers collection.
    return this.transfers.length;
  }


  /**
   * Calculates the number of stock transfers currently pending.
   *
   * @returns The total number of pending transfers.
   */
  get pendingTransfers(): number {

    // Count transfers whose status is PENDING.
    return this.transfers.filter(
      transfer => transfer.status === 'PENDING'
    ).length;
  }


  /**
   * Calculates the number of successfully completed stock transfers.
   *
   * @returns The total number of completed transfers.
   */
  get completedTransfers(): number {

    // Count transfers whose status is COMPLETED.
    return this.transfers.filter(
      transfer => transfer.status === 'COMPLETED'
    ).length;
  }


  /**
   * Calculates the number of cancelled stock transfers.
   *
   * @returns The total number of cancelled transfers.
   */
  get cancelledTransfers(): number {

    // Count transfers whose status is CANCELLED.
    return this.transfers.filter(
      transfer => transfer.status === 'CANCELLED'
    ).length;
  }


  // ==========================================
  // GET TRANSFER STATUS LABEL
  // ==========================================

  /**
   * Converts a transfer status into a human-readable label.
   *
   * Maps the backend status values to their corresponding
   * display labels used throughout the application.
   *
   * @param status - The transfer status returned by the backend.
   * @returns The corresponding readable status label.
   */
  getStatusLabel(status: string): string {

    // Defines the display labels associated with each transfer status.
    const labels: Record<string, string> = {
      PENDING: 'Pending',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled'
    };

    // Return the corresponding label or the original status as a fallback.
    return labels[status] ?? status;
  }


  // ==========================================
  // GET TRANSFER STATUS CSS CLASS
  // ==========================================

  /**
   * Returns the CSS classes associated with a transfer status.
   *
   * Assigns different visual styles to pending, completed
   * and cancelled transfers for status badge presentation.
   *
   * @param status - The transfer status returned by the backend.
   * @returns The CSS classes associated with the specified status.
   */
  getStatusClass(status: string): string {

    // Defines the CSS classes used for each transfer status.
    const classes: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20'
    };

    // Return the matching CSS classes.
    // Use neutral styling when the status is not recognized.
    return classes[status] ??
      'bg-gray-100 text-gray-700 ring-gray-500/20';
  }


  // ==========================================
  // TRACK TRANSFER TABLE ROWS
  // ==========================================

  /**
   * Provides a unique identifier for each stock transfer table row.
   *
   * Allows Angular to efficiently track transfer records
   * and minimize unnecessary DOM updates when the collection changes.
   *
   * @param index - The current position of the transfer in the collection.
   * @param transfer - The stock transfer associated with the current row.
   * @returns The unique identifier of the transfer.
   */
  trackById(index: number, transfer: StockTransfer): number {

    // Return the transfer ID as its unique tracking identifier.
    return transfer.id;
  }


  // ==========================================
  // OPEN TRANSFER DETAILS
  // ==========================================

  /**
   * Opens the transfer details modal for the selected stock transfer.
   *
   * Stores the selected transfer in the component state
   * and makes its details available to the modal.
   *
   * @param transfer - The stock transfer selected by the user.
   */
  viewDetails(transfer: StockTransfer): void {

    // Store the selected transfer for detailed inspection.
    this.selectedTransfer = transfer;

    // Display the transfer details modal.
    this.showDetailsModal = true;
  }


  // ==========================================
  // CLOSE TRANSFER DETAILS
  // ==========================================

  /**
   * Closes the transfer details modal.
   *
   * Resets the selected transfer and hides the modal
   * to prevent previously selected information from remaining active.
   */
  closeDetails(): void {

    // Hide the transfer details modal.
    this.showDetailsModal = false;

    // Clear the currently selected transfer.
    this.selectedTransfer = null;
  }
}
