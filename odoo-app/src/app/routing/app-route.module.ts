import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ResUsersComponent } from '../res_users/res_users.component';
import { ProductPricelistComponent } from '../product_pricelist/product_pricelist.component';
import { StockLocationComponent } from '../stock_location/stock_location.component';
import { TicketsAppComponent } from '../tickets-app/tickets-app.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { ProductosComponent } from '../productos/productos.component';
import { MetodoPagoComponent } from '../metodo_pago/metodo_pago.component';
import { ConexionComponent } from '../conexion/conexion.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ImpresorasComponent } from '../impresoras/impresoras.component';
import { SyncroComponent } from '../syncro/syncro.component';
import { PageNotFoundComponent } from '../not-found.component';

const appRoutes: Routes = [
  //{ path: 'hero/:id',      component: HeroDetailComponent },
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  //{ path: '', component: TicketsAppComponent },
  { path: 'conexion', component: ConexionComponent, data: { title: 'Odoo-app Moldeo / Conexion' } },
  { path: 'clientes', component: ClientesComponent, data: { title: 'Odoo-app Moldeo / Clientes' } },
  { path: 'productos', component: ProductosComponent, data: { title: 'Odoo-app Moldeo / Productos' } },
  { path: 'metodospago', component: MetodoPagoComponent, data: { title: 'Odoo-app Moldeo / Metodos Pago' } },
  { path: 'stocklocation', component: StockLocationComponent, data: { title: 'Odoo-app Moldeo / Depósitos' } },
  { path: 'productpricelist', component: ProductPricelistComponent, data: { title: 'Odoo-app Moldeo / Listas de Precios' } },
  { path: 'resusers', component: ResUsersComponent, data: { title: 'Odoo-app Moldeo / Vendedores' } },
  { path: 'syncro', component: SyncroComponent, data: { title: 'Odoo-app Moldeo / Syncros' } },
  { path: 'tickets', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Tickets' } },
  { path: 'tickets/new', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Nuevo Ticket', action: 'new' } },
  { path: 'tickets/edit/:id', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Editar Ticket', action: 'edit' } },
  { path: 'tickets/view/:id', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Viendo Ticket', action: 'view' } },
  { path: 'tickets/delete/:id', component: TicketsAppComponent, data: { title: 'Odoo-app Moldeo / Borrar Ticket', action: 'delete' } },
  { path: 'about', component: AboutComponent, data: { title: 'Odoo-app Moldeo / Acerca' } },
  { path: 'impresoras', component: ImpresorasComponent, data: { title: 'Odoo-app Moldeo / Impresoras' } },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
      /*{ preloadingStrategy: SelectivePreloadingStrategy }*/
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    /*
    CanDeactivateGuard,
    SelectivePreloadingStrategy
    */
  ]
})
export class AppRoutingModule {}
//export const AppRoutingModule = RouterModule.forRoot(appRoutes);
