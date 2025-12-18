import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@authservices/auth.service';
import { ProductCard } from '@producs/components/product-card/product-card';
import { ProductsService } from '@producs/services/products.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';
// import { ProductCard } from "../../../products/components/product-card/product-card";

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage { 

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  authService = inject(AuthService);

  productsResource = rxResource({
    //Le restamos 1 porque la primera pagina es 0
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      console.log(this.authService.user());
      return this.productsService.getProducts({
        offset: params.page * 9
      });
    }
  })

}
