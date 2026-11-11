import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Supplier, SupplierPayload } from '../../models/supplier';
import { SupplierService } from '../../service/supplierService';


/**
 * Suppliers component responsible for managing and displaying suppliers.
 *
 * Retrieves supplier records from the backend and allows users to search,
 * create, view and edit supplier information.
 *
 * Provides supplier summary statistics and modal dialogs
 * for adding, viewing and editing individual supplier records.
 */
@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './suppliers.html'
})

export class Suppliers implements OnInit {
  // ==========================================
  // DEPENDENCIES
  // ==========================================
  // Injects the service responsible for retrieving and managing suppliers.
  private readonly supplierService = inject(SupplierService);

  // ==========================================
  // SUPPLIER DATA
  // ==========================================
  // Stores all supplier records retrieved from the backend API.
  suppliers: Supplier[] = [];

  // ==========================================
  // SEARCH AND FILTER STATES
  // ==========================================
  // Stores the search term currently entered by the user
  searchTerm = '';

  // Stores the search term applied when the user performs a search.
  // Separates the input value from the active filtering criteria.
  appliedSearchTerm = '';

  // ==========================================
  // COMPONENT STATES
  // ==========================================
  // Indicates whether a supplier-related operation is currently in progress.
  loading = false;

  // Stores error messages displayed when an operation fails.
  errorMessage = '';

  // ==========================================
  // SUPPLIER MODAL STATES
  // ==========================================
  // Controls the visibility of the add supplier modal.
  showAddSupplierModal = false;

  // Controls the visibility of the supplier details modal.
  showViewSupplierModal = false;

  // Controls the visibility of the edit supplier modal.
  showEditSupplierModal = false;

  // Stores the supplier currently selected for viewing or editing.
  // Remains null when no supplier is selected.
  selectedSupplier: Supplier | null = null;

  // ==========================================
  // SUPPLIER FORM DATA
  // ==========================================
  // Stores the information entered when creating a new supplier.
  // Initializes with an empty supplier payload.
  newSupplier: SupplierPayload = this.emptySupplier();
  // Stores the information entered when editing an existing supplier.
  // Initializes with an empty supplier payload.
  editSupplierData: SupplierPayload = this.emptySupplier();


  // ==========================================
  // INITIALIZATION
  // ==========================================
  /**
   * Initializes the suppliers component.
   *
   * Retrieves the existing supplier records from the backend
   * to populate the supplier collection.
   */
  ngOnInit(): void {
    // Load all registered suppliers.
    this.loadSuppliers();
  }

  // ==========================================
  // EMPTY SUPPLIER FORM
  // ==========================================
  /**
   * Creates an empty supplier payload with default values.
   *
   * Initializes all supplier fields to their default states.
   * Optional fields are assigned null and the supplier is
   * marked as active by default.
   *
   * @returns A new supplier payload containing default values.
   */
  private emptySupplier(): SupplierPayload {
    // Return a supplier payload initialized with default values.
    return {
      name: '',
      email: null,
      phone: null,
      address: null,
      taxNumber: null,
      active: true
    };
  }

  // ==========================================
  // LOAD SUPPLIERS
  // ==========================================
  /**
   * Retrieves all supplier records from the backend.
   *
   * Updates the component state with the returned suppliers
   * and manages the loading and error states during the request.
   */
  loadSuppliers(): void {
    // Activates the loading indicator before requesting the data.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Requests all registered suppliers from the backend API.
    this.supplierService.getSuppliers().subscribe({
      // Handles the successful response from the backend.
      next: (suppliers) => {
        // Logs the retrieved suppliers for debugging purposes.
        console.log('Suppliers received:', suppliers);
        // Stores the retrieved supplier records.
        this.suppliers = suppliers;
        // Deactivates the loading indicator after receiving the data.
        this.loading = false;
      },
      // Handles errors returned while retrieving suppliers.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Error loading suppliers:', error);
        // Displays an appropriate error message based on the HTTP status.
        this.errorMessage =
          error.status === 401
            ? 'Authentication required. Please log in again.'
            : 'Unable to load suppliers. Please try again.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }


  // ==========================================
  // SEARCH SUPPLIERS
  // ==========================================
  /**
   * Applies the search term entered by the user.
   *
   * Removes surrounding whitespace and updates the active
   * search criteria used by the supplier filtering process.
   */
  searchSuppliers(): void {
    // Apply the normalized search term.
    this.appliedSearchTerm = this.searchTerm.trim();
  }

  // ==========================================
  // CLEAR SUPPLIER SEARCH
  // ==========================================
  /**
   * Clears the supplier search input and active search criteria.
   *
   * Resets both search properties to restore the complete
   * supplier collection.
   */
  clearSearch(): void {
    // Clear the search input entered by the user.
    this.searchTerm = '';
    // Remove the currently applied search filter.
    this.appliedSearchTerm = '';
  }

  // ==========================================
  // FILTER SUPPLIERS
  // ==========================================
  /**
   * Returns suppliers filtered by the currently applied search term.
   *
   * Searches supplier records by name using case-insensitive matching.
   * Returns the complete supplier collection when no search term is provided.
   *
   * @returns The list of suppliers matching the active search criteria.
   */
  get filteredSuppliers(): Supplier[] {
    // Normalize the applied search term by converting it to lowercase.
    const term = this.appliedSearchTerm.toLowerCase();
    // Return all suppliers when no search term is provided.
    if (!term) {
      return this.suppliers;
    }
    // Filter suppliers by their registered names.
    return this.suppliers.filter(supplier =>
      // Include suppliers whose names contain the search term.
      (supplier.name ?? '').toLowerCase().includes(term)
    );
  }

  // ==========================================
  // SUPPLIER SUMMARY STATISTICS
  // ==========================================
  /**
   * Returns the total number of registered suppliers.
   *
   * @returns The total number of suppliers.
   */
  get totalSuppliers(): number {
    // Return the number of records in the suppliers collection.
    return this.suppliers.length;
  }

  /**
   * Calculates the number of currently active suppliers.
   *
   * @returns The total number of active suppliers.
   */
  get activeSuppliers(): number {
    // Count suppliers whose active property is true.
    return this.suppliers.filter(supplier => supplier.active).length;
  }

  /**
   * Calculates the number of currently inactive suppliers.
   *
   * @returns The total number of inactive suppliers.
   */
  get inactiveSuppliers(): number {
    // Count suppliers whose active property is false.
    return this.suppliers.filter(supplier => !supplier.active).length;
  }

  // ==========================================
  // TRACK SUPPLIER TABLE ROWS
  // ==========================================

  /**
   * Provides a unique identifier for each supplier table row.
   *
   * Allows Angular to efficiently track supplier records
   * and minimize unnecessary DOM updates when the collection changes.
   *
   * @param index - The current position of the supplier in the collection.
   * @param supplier - The supplier associated with the current row.
   * @returns The unique identifier of the supplier.
   */
  trackById(index: number, supplier: Supplier): number {
    // Return the supplier ID as its unique tracking identifier.
    return supplier.id;
  }

  // ==========================================
  // OPEN ADD SUPPLIER MODAL
  // ==========================================
  /**
   * Opens the modal for registering a new supplier.
   *
   * Resets the supplier form and clears previous error messages
   * before displaying the registration modal.
   */
  addSupplier(): void {
    // Initialize the new supplier form with default values.
    this.newSupplier = this.emptySupplier();
    // Clear any previous error message.
    this.errorMessage = '';
    // Display the add supplier modal.
    this.showAddSupplierModal = true;
  }

  // ==========================================
  // CLOSE ADD SUPPLIER MODAL
  // ==========================================
  /**
   * Closes the add supplier modal.
   *
   * Hides the supplier registration interface.
   */
  closeAddSupplier(): void {
    // Hide the add supplier modal.
    this.showAddSupplierModal = false;
  }

  // ==========================================
  // CREATE SUPPLIER
  // ==========================================
  /**
   * Creates a new supplier using the information entered by the user.
   *
   * Normalizes the supplier form data and validates the required name
   * before submitting the registration request to the backend.
   *
   * Updates the supplier collection when the operation succeeds
   * and manages the loading and error states during the request.
   */
  createSupplier(): void {
    // Normalize the supplier form data before submission.
    const payload = this.normalizePayload(this.newSupplier);
    // Validate that the supplier name has been provided.
    if (!payload.name) {
      // Display an error message when the supplier name is missing.
      this.errorMessage = 'Supplier name is required.';
      // Stop the registration process when validation fails.
      return;
    }
    // Activates the loading indicator before submitting the request.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Sends the new supplier information to the backend API.
    this.supplierService.createSupplier(payload).subscribe({
      // Handles the successful supplier creation response.
      next: (supplier) => {
        // Add the newly created supplier to the existing collection.
        this.suppliers = [...this.suppliers, supplier];
        // Close the add supplier modal.
        this.showAddSupplierModal = false;
        // Reset the supplier registration form.
        this.newSupplier = this.emptySupplier();
        // Deactivates the loading indicator after successful creation.
        this.loading = false;
      },
      // Handles errors returned while creating the supplier.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Error creating supplier:', error);
        // Displays the error detail, message or a default fallback.
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to create supplier.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }


  // ==========================================
  // OPEN SUPPLIER DETAILS
  // ==========================================
  /**
   * Opens the supplier details modal for the selected supplier.
   *
   * Stores the selected supplier in the component state
   * and makes its information available to the details modal.
   *
   * @param supplier - The supplier selected by the user.
   */
  viewSupplier(supplier: Supplier): void {
    // Store the selected supplier for detailed inspection.
    this.selectedSupplier = supplier;
    // Display the supplier details modal.
    this.showViewSupplierModal = true;
  }

  // ==========================================
  // OPEN EDIT SUPPLIER MODAL
  // ==========================================
  /**
   * Opens the edit modal for the selected supplier.
   *
   * Copies the existing supplier information into the edit form
   * and prepares the component state for updating the supplier.
   *
   * Closes the details modal when opening the edit interface.
   *
   * @param supplier - The supplier selected for editing.
   */
  editSupplier(supplier: Supplier): void {
    // Store the selected supplier for editing.
    this.selectedSupplier = supplier;
    // Populate the edit form with the existing supplier information.
    // Optional fields are assigned null when their values are missing.
    this.editSupplierData = {
      name: supplier.name ?? '',
      email: supplier.email ?? null,
      phone: supplier.phone ?? null,
      address: supplier.address ?? null,
      taxNumber: supplier.taxNumber ?? null,
      active: supplier.active
    };
    // Clear any previous error message.
    this.errorMessage = '';
    // Close the supplier details modal.
    this.showViewSupplierModal = false;
    // Display the edit supplier modal.
    this.showEditSupplierModal = true;
  }

  // ==========================================
  // CLOSE SUPPLIER DETAILS MODAL
  // =========================================
  /**
   * Closes the supplier details modal.
   *
   * Resets the selected supplier and hides the details interface
   * to prevent previously selected information from remaining active.
   */
  closeViewSupplier(): void {
    // Hide the supplier details modal.
    this.showViewSupplierModal = false;
    // Clear the currently selected supplier.
    this.selectedSupplier = null;
  }


  // ==========================================
  // CLOSE EDIT SUPPLIER MODAL
  // ==========================================
  /**
   * Closes the edit supplier modal.
   *
   * Resets the selected supplier and hides the editing interface.
   */
  closeEditSupplier(): void {
    // Hide the edit supplier modal.
    this.showEditSupplierModal = false;
    // Clear the currently selected supplier.
    this.selectedSupplier = null;
  }


  // ==========================================
  // SAVE SUPPLIER CHANGES
  // ==========================================
  /**
   * Saves the modifications made to the selected supplier.
   *
   * Validates the selected supplier and the required name field,
   * normalizes the edited information and submits the update request
   * to the backend API.
   *
   * Updates the supplier collection when the operation succeeds
   * and manages the loading and error states during the request.
   */
  saveSupplierChanges(): void {
    // Validate that a supplier is currently selected for editing.
    if (!this.selectedSupplier) {
      // Display an error message when no supplier is selected.
      this.errorMessage = 'No supplier selected.';
      // Stop the update process when no supplier is available.
      return;
    }
    // Store the ID of the supplier being updated.
    const id = this.selectedSupplier.id;
    // Normalize the edited supplier information before submission.
    const payload = this.normalizePayload(this.editSupplierData);
    // Validate that the supplier name has been provided.
    if (!payload.name) {
      // Display an error message when the supplier name is missing.
      this.errorMessage = 'Supplier name is required.';
      // Stop the update process when validation fails.
      return;
    }
    // Activates the loading indicator before submitting the request.
    this.loading = true;
    // Clears any previous error message.
    this.errorMessage = '';
    // Sends the updated supplier information to the backend API.
    this.supplierService.updateSupplier(id, payload).subscribe({
      // Handles the successful supplier update response.
      next: (updatedSupplier) => {
        // Replace the existing supplier with the updated information.
        this.suppliers = this.suppliers.map(supplier =>
          // Update only the supplier matching the selected ID.
          supplier.id === id
            ? { ...supplier, ...updatedSupplier }
            : supplier
        );
        // Close the edit supplier modal.
        this.showEditSupplierModal = false;
        // Clear the currently selected supplier.
        this.selectedSupplier = null;
        // Deactivates the loading indicator after successful updating.
        this.loading = false;
      },
      // Handles errors returned while updating the supplier.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Error updating supplier:', error);
        // Displays the error detail, message or a default fallback.
        this.errorMessage =
          error.error?.detail ??
          error.error?.message ??
          'Unable to update supplier.';
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }

  // ==========================================
  // NORMALIZE SUPPLIER PAYLOAD
  // ==========================================
  /**
   * Normalizes supplier information before sending it to the backend.
   *
   * Removes unnecessary whitespace from text fields
   * and converts empty optional fields into null values.
   *
   * Preserves the supplier active status.
   *
   * @param data - The supplier information to normalize.
   * @returns A normalized supplier payload ready for API submission.
   */
  private normalizePayload(data: SupplierPayload): SupplierPayload {
    // Return a normalized supplier payload.
    return {
      // Remove surrounding whitespace from the supplier name.
      name: data.name.trim(),
      // Normalize the email or assign null when it is empty.
      email: data.email?.trim() || null,
      // Normalize the phone number or assign null when it is empty.
      phone: data.phone?.trim() || null,
      // Normalize the address or assign null when it is empty.
      address: data.address?.trim() || null,
      // Normalize the tax number or assign null when it is empty.
      taxNumber: data.taxNumber?.trim() || null,
      // Preserve the current supplier active status.
      active: data.active
    };
  }
}
