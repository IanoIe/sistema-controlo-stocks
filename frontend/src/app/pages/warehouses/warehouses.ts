import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../service/WarehouseService';

/**
 * Warehouses component responsible for managing and displaying warehouses.
 *
 * Retrieves warehouse records from the backend and allows users to search,
 * create, view and edit warehouse information.
 *
 * Provides warehouse summary statistics and modal dialogs
 * for adding, viewing and editing individual warehouse records.
 */
@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './warehouses.html'
})

export class Warehouses implements OnInit {
  // ==========================================
  // DEPENDENCIES
  // ==========================================
  // Injects the service responsible for retrieving and managing warehouses.
  private readonly warehouseService = inject(WarehouseService);

  // ==========================================
  // WAREHOUSE DATA
  // ==========================================
  // Stores all warehouse records retrieved from the backend API.
  warehouses: Warehouse[] = [];

  // ==========================================
  // SEARCH AND FILTER STATES
  // ==========================================
  // Stores the search term currently entered by the user.
  searchTerm = '';

  // Stores the search term applied when the user performs a search.
  // Separates the input value from the active filtering criteria.
  appliedSearchTerm = '';

  // ==========================================
  // COMPONENT STATES
  // ==========================================
  // Indicates whether a warehouse-related operation is currently in progress.
  loading = false;

  // Stores error messages displayed when an operation fails.
  errorMessage = '';

  // ==========================================
  // WAREHOUSE MODAL STATES
  // ==========================================
  // Controls the visibility of the add warehouse modal.
  showAddWarehouseModal = false;

  // Controls the visibility of the warehouse details modal.
  showViewWarehouseModal = false;

  // Controls the visibility of the edit warehouse modal.
  showEditWarehouseModal = false;

  // ==========================================
  // WAREHOUSE FORM DATA
  // ==========================================
  // Stores the information entered when creating a new warehouse.
  // Initializes the warehouse with empty fields and an active status.
  newWarehouse = {
    name: '',
    location: '',
    active: true
  };
  // Stores the warehouse currently selected for viewing or editing.
  // Remains null when no warehouse is selected.
  selectedWarehouse: Warehouse | null = null;
  // Stores the information entered when editing an existing warehouse.
  // Initializes with default values before a warehouse is selected.
  editWarehouseData = {
    name: '',
    location: '',
    active: true
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  /**
   * Initializes the warehouses component.
   *
   * Retrieves the existing warehouse records from the backend
   * to populate the warehouse collection.
   */
  ngOnInit(): void {
    // Load all registered warehouses.
    this.loadWarehouses();
  }

  // ==========================================
  // SEARCH WAREHOUSES
  // ==========================================
  /**
   * Applies the search term entered by the user.
   *
   * Removes surrounding whitespace and updates the active
   * search criteria used by the warehouse filtering process.
   */
  searchWarehouses(): void {
    // Apply the normalized search term.
    this.appliedSearchTerm = this.searchTerm.trim();
  }

  // ==========================================
  // CLEAR WAREHOUSE SEARCH
  // ==========================================
  /**
   * Clears the warehouse search input and active search criteria.
   *
   * Resets both search properties to restore the complete
   * warehouse collection.
   */
  clearSearch(): void {
    // Clear the search input entered by the user.
    this.searchTerm = '';
    // Remove the currently applied search filter.
    this.appliedSearchTerm = '';
  }

  // ==========================================
  // LOAD WAREHOUSES
  // ==========================================
  /**
   * Retrieves all warehouse records from the backend.
   *
   * Supports both standard array responses and Hydra collection
   * responses returned by API Platform.
   *
   * Updates the component state with the retrieved warehouses
   * and manages the loading and error states during the request.
   *
   * Displays an error message when the API response does not
   * contain a valid warehouse collection.
   */
  loadWarehouses(): void {
    // Activates the loading indicator before requesting the data.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Requests all registered warehouses from the backend API.
    this.warehouseService.getWarehouses().subscribe({
      // Handles the successful response from the backend.
      next: (response: any) => {
        // Logs the retrieved warehouse response for debugging purposes.
        console.log('Warehouses recebidos:', response);
        // API Platform can return a Hydra collection.
        // Extracts the warehouse records from either a standard array
        // or the member property of a Hydra response.
        const items = Array.isArray(response)
          ? response
          : response?.member;
        // Validates whether the extracted response contains an array.
        if (!Array.isArray(items)) {
          // Logs the unexpected response format for debugging purposes.
          console.error('Unexpected response format:', response);
          // Clears the warehouse collection when the response is invalid.
          this.warehouses = [];
          // Displays an error message indicating an invalid API response.
          this.errorMessage = 'The API response does not contain a valid list of warehouses.';
          // Deactivates the loading indicator.
          this.loading = false;
          // Stop processing when the response format is invalid.
          return;
        }
        // Stores the retrieved warehouse records.
        this.warehouses = items;
        // Deactivates the loading indicator after receiving the data.
        this.loading = false;
      },
      // Handles errors returned while retrieving warehouses.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Error loading warehouses:', error);
        // Displays an appropriate error message based on the HTTP status.
        this.errorMessage =
          error.status === 401
            ? 'Authentication required. Please log in again.'
            : 'Unable to load warehouses. Please try again.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }

  // ==========================================
  // FILTER WAREHOUSES
  // ==========================================
  /**
   * Returns warehouses filtered by the currently applied search term.
   *
   * Removes surrounding whitespace and performs case-insensitive
   * matching against warehouse names.
   *
   * Uses startsWith to include only warehouse names beginning
   * with the supplied search term.
   *
   * Returns the complete warehouse collection when no search term is provided.
   *
   * @returns The list of warehouses matching the active search criteria.
   */
  get filteredWarehouses(): Warehouse[] {
    // Normalize the applied search term by removing surrounding spaces
    // and converting all characters to lowercase.
    const term = this.appliedSearchTerm.trim().toLowerCase();
    // Return all warehouses when no search term is provided.
    if (!term) {
      return this.warehouses;
    }
    // Filter warehouses by their registered names.
    return this.warehouses.filter(warehouse =>
      // Include warehouses whose names start with the search term.
      (warehouse.name ?? '').toLowerCase().startsWith(term)
    );
  }

  // ==========================================
  // WAREHOUSE SUMMARY STATISTICS
  // ==========================================
  /**
   * Returns the total number of registered warehouses.
   *
   * @returns The total number of warehouses.
   */
  get totalWarehouses(): number {
    // Return the number of records in the warehouses collection.
    return this.warehouses.length;
  }

  /**
   * Calculates the number of currently active warehouses.
   *
   * @returns The total number of active warehouses.
   */
  get activeWarehouses(): number {
    // Count warehouses whose active property is true.
    return this.warehouses.filter(w => w.active).length;
  }

  /**
   * Calculates the number of currently inactive warehouses.
   *
   * @returns The total number of inactive warehouses.
   */
  get inactiveWarehouses(): number {
    // Count warehouses whose active property is false.
    return this.warehouses.filter(w => !w.active).length;
  }


  // ==========================================
  // TRACK WAREHOUSE TABLE ROWS
  // ==========================================
  /**
   * Provides a unique identifier for each warehouse table row.
   *
   * Allows Angular to efficiently track warehouse records
   * and minimize unnecessary DOM updates when the collection changes.
   *
   * @param index - The current position of the warehouse in the collection.
   * @param warehouse - The warehouse associated with the current row.
   * @returns The unique identifier of the warehouse.
   */
  trackById(index: number, warehouse: Warehouse): number {
    // Return the warehouse ID as its unique tracking identifier.
    return warehouse.id;
  }

  // ==========================================
  // CREATE WAREHOUSE
  // ==========================================
  /**
   * Creates a new warehouse using the information entered by the user.
   *
   * Normalizes the warehouse name and location by removing
   * surrounding whitespace and validates the required fields
   * before submitting the registration request to the backend.
   *
   * Reloads the warehouse collection after successful creation
   * and manages the loading and error states during the request.
   */
  createWarehouse(): void {
    // Normalize the warehouse name by removing surrounding whitespace.
    const name = this.newWarehouse.name.trim();
    // Normalize the warehouse location by removing surrounding whitespace.
    const location = this.newWarehouse.location.trim();
    // Validate that both the warehouse name and location are provided.
    if (!name || !location) {
      // Display an error message when required fields are missing.
      this.errorMessage = 'Name and location are required.';
      // Stop the registration process when validation fails.
      return;
    }
    // Activates the loading indicator before submitting the request.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Sends the new warehouse information to the backend API.
    this.warehouseService.createWarehouse({
      name,
      location,
      active: this.newWarehouse.active
    }).subscribe({
      // Handles the successful warehouse creation response.
      next: (warehouse) => {
        // Logs the newly created warehouse for debugging purposes.
        console.log('Warehouse criado:', warehouse);
        // Close the add warehouse modal.
        this.showAddWarehouseModal = false;
        // Reset the warehouse registration form to its default values.
        this.newWarehouse = {
          name: '',
          location: '',
          active: true
        };
        // Reload the warehouse collection to include the newly created record.
        this.loadWarehouses();
      },
      // Handles errors returned while creating the warehouse.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Erro ao criar warehouse:', error);
        // Displays the error detail, message or a default fallback.
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to create warehouse.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }

  // ==========================================
  // OPEN WAREHOUSE DETAILS
  // ==========================================
  /**
   * Opens the warehouse details modal for the selected warehouse.
   *
   * Stores the selected warehouse in the component state
   * and makes its information available to the details modal.
   *
   * @param warehouse - The warehouse selected by the user.
   */
  viewWarehouse(warehouse: Warehouse): void {
    // Store the selected warehouse for detailed inspection.
    this.selectedWarehouse = warehouse;
    // Display the warehouse details modal.
    this.showViewWarehouseModal = true;
  }

  // ==========================================
  // CLOSE WAREHOUSE DETAILS MODAL
  // ==========================================
  /**
   * Closes the warehouse details modal.
   *
   * Resets the selected warehouse and hides the details interface
   * to prevent previously selected information from remaining active.
   */
  closeViewWarehouse(): void {
    // Hide the warehouse details modal.
    this.showViewWarehouseModal = false;
    // Clear the currently selected warehouse.
    this.selectedWarehouse = null;
  }

  // ==========================================
  // OPEN ADD WAREHOUSE MODAL
  // ==========================================
  /**
   * Opens the modal for registering a new warehouse.
   *
   * Resets the warehouse form and clears previous error messages
   * before displaying the registration modal.
   */
  addWarehouse(): void {
    // Initialize the new warehouse form with default values.
    this.newWarehouse = {
      name: '',
      location: '',
      active: true
    };
    // Clear any previous error message.
    this.errorMessage = '';
    // Display the add warehouse modal.
    this.showAddWarehouseModal = true;
  }

  // ==========================================
  // CLOSE ADD WAREHOUSE MODAL
  // ==========================================
  /**
   * Closes the add warehouse modal.
   *
   * Hides the warehouse registration interface.
   */
  closeAddWarehouse(): void {
    // Hide the add warehouse modal.
    this.showAddWarehouseModal = false;
  }

  // ==========================================
  // OPEN EDIT WAREHOUSE MODAL
  // ==========================================
  /**
   * Opens the edit modal for the selected warehouse.
   *
   * Copies the existing warehouse information into the edit form
   * and prepares the component state for updating the warehouse.
   *
   * @param warehouse - The warehouse selected for editing.
   */
  editWarehouse(warehouse: Warehouse): void {
    // Store the selected warehouse for editing.
    this.selectedWarehouse = warehouse;
    // Populate the edit form with the existing warehouse information.
    this.editWarehouseData = {
      name: warehouse.name,
      location: warehouse.location,
      active: warehouse.active
    };
    // Clear any previous error message.
    this.errorMessage = '';
    // Display the edit warehouse modal.
    this.showEditWarehouseModal = true;
  }


  // ==========================================
  // CLOSE EDIT WAREHOUSE MODAL
  // ==========================================
  /**
   * Closes the edit warehouse modal.
   *
   * Resets the selected warehouse and hides the editing interface.
   */
  closeEditWarehouse(): void {
    // Hide the edit warehouse modal.
    this.showEditWarehouseModal = false;
    // Clear the currently selected warehouse.
    this.selectedWarehouse = null;
  }

  // ==========================================
  // SAVE WAREHOUSE CHANGES
  // ==========================================
  /**
   * Saves the modifications made to the selected warehouse.
   *
   * Validates the selected warehouse and the required name and location
   * fields, normalizes the edited information and submits the update
   * request to the backend API.
   *
   * Updates the warehouse collection when the operation succeeds
   * and manages the loading and error states during the request.
   */
  saveWarehouseChanges(): void {
    // Validate that a warehouse is currently selected for editing.
    if (!this.selectedWarehouse) {
      // Display an error message when no warehouse is selected.
      this.errorMessage = 'No warehouse selected.';
      // Stop the update process when no warehouse is available.
      return;
    }
    // Store the ID of the warehouse being updated.
    const id = this.selectedWarehouse.id;
    // Prepare the updated warehouse information.
    // Remove surrounding whitespace from the name and location fields.
    const payload = {
      name: this.editWarehouseData.name.trim(),
      location: this.editWarehouseData.location.trim(),
      active: this.editWarehouseData.active
    };
    // Validate that both the warehouse name and location are provided.
    if (!payload.name || !payload.location) {
      // Display an error message when required fields are missing.
      this.errorMessage = 'Name and location are required.';
      // Stop the update process when validation fails.
      return;
    }
    // Activates the loading indicator before submitting the request.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Sends the updated warehouse information to the backend API.
    this.warehouseService.updateWarehouse(id, payload).subscribe({
      // Handles the successful warehouse update response.
      next: (updatedWarehouse) => {
        // Logs the updated warehouse for debugging purposes.
        console.log('Warehouse updated:', updatedWarehouse);
        // Replace the existing warehouse with the updated information.
        this.warehouses = this.warehouses.map(warehouse =>
          // Update only the warehouse matching the selected ID.
          warehouse.id === id
            ? { ...warehouse, ...updatedWarehouse }
            : warehouse
        );
        // Close the edit warehouse modal.
        this.showEditWarehouseModal = false;
        // Clear the currently selected warehouse.
        this.selectedWarehouse = null;
        // Deactivates the loading indicator after successful updating.
        this.loading = false;
      },
      // Handles errors returned while updating the warehouse.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Error updating warehouse:', error);
        // Displays the error detail, message or a default fallback.
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to update warehouse.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }
}
