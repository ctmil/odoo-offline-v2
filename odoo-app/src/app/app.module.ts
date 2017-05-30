
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
// import pagination module
import {Ng2PaginationModule} from 'ng2-pagination'; // <-- import the module

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-route.module';
import { LoginRoutingModule } from './routing/login-route.module';

import { TicketsAppComponent } from './tickets-app/tickets-app.component';
import { TicketItemsComponent } from './tickets-app/ticket-items/ticket-items.component';
import { TicketPaymentsComponent } from './tickets-app/ticket-payments/ticket-payments.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { ConexionComponent } from './conexion/conexion.component';
import { MetodoPagoComponent } from './metodo_pago/metodo_pago.component';
import { StockLocationComponent } from './stock_location/stock_location.component';
import { ResUsersComponent } from './res_users/res_users.component';
import { ProductPricelistComponent } from './product_pricelist/product_pricelist.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SyncroComponent } from './syncro/syncro.component';
import { PageNotFoundComponent } from './not-found.component';
import { LoginComponent }       from './login.component';
import { LocalStorageModule } from 'angular-2-local-storage';
//var ngSQLite = require('angular-sqlite');
import { DropdownModule } from "ngx-dropdown";
import { CollapseDirective } from 'ng2-bootstrap'
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
//import { Ng2UIModule }    from 'ng2-ui';
//import { Ng2UtilsModule } from 'ng2-utils';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from 'ng2-config';
import { Ng2DatetimePickerModule } from 'ng2-datetime-picker';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
// imports datatable
import {DataTableModule} from "angular2-datatable";

export function configFactory() {
    return new ConfigStaticLoader('/config.json'); // PATH || API ENDPOINT
}

@NgModule({
  declarations: [
    AppComponent,
    ConexionComponent,
    TicketsAppComponent,
    TicketItemsComponent,
    TicketPaymentsComponent,
    ClientesComponent,
    MetodoPagoComponent,
    StockLocationComponent,
    ResUsersComponent,
    ProductPricelistComponent,
    ProductosComponent,
    HomeComponent,
    AboutComponent,
    SyncroComponent,
    PageNotFoundComponent,
    LoginComponent,
    CollapseDirective
  ],
  imports: [
    LocalStorageModule.withConfig({
            prefix: 'odoo-app',
            storageType: 'localStorage'
    }),
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory)
    }),
    AppRoutingModule,
    LoginRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2PaginationModule,
		DataTableModule,
    DropdownModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    Ng2AutoCompleteModule,
    Ng2DatetimePickerModule,
    Ng2FilterPipeModule

  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {


 }
