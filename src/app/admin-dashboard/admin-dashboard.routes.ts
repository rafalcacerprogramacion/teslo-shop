import { Routes } from "@angular/router";
import { AdminDashboardLayout } from "@dashboardlayouts/admin-dashboard-layout/admin-dashboard-layout";
import { ProductAdminPage } from "@dashboardpages/product-admin-page/product-admin-page";
import { ProductsAdminPage } from "@dashboardpages/products-admin-page/products-admin-page";

export const adminDashboardRoutes: Routes = [

  {
    path: '',
    component: AdminDashboardLayout,
    children: [
      {
        path: 'products',
        component: ProductsAdminPage
      },
      {
        path: 'products/:id',
        component: ProductAdminPage
      },
      {
        path: '**',
        redirectTo: 'products'
      },
    ]
  },

];

export default adminDashboardRoutes;