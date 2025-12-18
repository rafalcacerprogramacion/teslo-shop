import { Component, input } from '@angular/core';
import { Product } from '@producs/interfaces/product.interface';
import { ProductImagePipe } from '@producs/pipes/product-image.pipe';
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable { 

  products = input.required<Product[]>();
}
