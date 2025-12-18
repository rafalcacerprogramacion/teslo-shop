import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductTable } from "@producs/components/product-table/product-table";
import { ProductsService } from '@producs/services/products.service';
import { map } from 'rxjs';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductTable, ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);
  router = inject(Router);
  productId = toSignal( this.activatedRoute.params.pipe(
    map((params) => params['id']))
  );

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productService.getProductById( params.id )
    }
  })

  redirectEffect = effect(() => {
    if ( this.productResource.error() ) this.router.navigate(['/admin/products']);
  })
}
