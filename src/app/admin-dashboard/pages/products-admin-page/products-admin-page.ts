import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@authservices/auth.service';
import { ProductTable } from "@producs/components/product-table/product-table";
import { ProductsService } from '@producs/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage { 

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  authService = inject(AuthService);
  productsPerPage = signal(10);
 
  products = rxResource({
    //Le restamos 1 porque la primera pagina es 0
    params: () => ({ page: this.paginationService.currentPage() - 1, perPage: this.productsPerPage() }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
        limit: params.perPage
      });
    }
  })
}
