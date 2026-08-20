import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Sidebar } from "../../layout/sidebar/sidebar";


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './product-form.html'
})

export class ProductForm {

  product = {
    codeProduct: '',
    nameProduct: '',
    category: '',
    price: '',
    quantity: '',
    stockMin: ''
  };

}
