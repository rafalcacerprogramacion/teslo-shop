import { Component, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@producs/services/products.service';
import { EMPTY } from 'rxjs';
import { ProductCarousel } from "@producs/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage{ 

  productsService = inject(ProductsService);
  slugParam = inject(ActivatedRoute).snapshot.params['idSlug'];

  productsResource = rxResource({
    params: () => ({ idSlug: this.slugParam }),
    stream: ({ params }) => {
      return params.idSlug ? this.productsService.getProductByIdSlug(params.idSlug) : EMPTY;
    }
  })
}
