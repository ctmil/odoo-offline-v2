import {Http} from '@angular/http';
import { NgModule, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { FormsModule } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';

//======App
import { DialogService } from './dialog.service';
import { ConexionService } from './conexion.service';
import { ConexionData } from './conexion-data';
import { ConexionComponent } from './conexion/conexion.component';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: "odoo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [ConexionService, DialogService]
})

export class AppComponent implements OnInit, OnDestroy {
  private timer;
  // Subscription object
  private sub: Subscription;
  ticks = 0;

  title = "Cliente Odoo App";
  public isCollapsed: boolean = true;

  autoSinc: boolean = false;
  isConnected: boolean = false;
  connectedServerString: string = "";

  cx_connectedOk_sub: Subscription;
  cx_connectedServerString_sub: Subscription;

  cx_product_pricelist_sub: Subscription;
  cx_stock_location_sub: Subscription;
  cx_res_users_sub: Subscription;
  cx_metodo_pago_sub: Subscription;
  cx_product_product_sub: Subscription;
  cx_res_partner_sub: Subscription;
  cx_tickets_sub: Subscription;

  // data_json
  data_json;

  //private extractData(res: Response) {
  //  let body = res.json();
  //  console.log('JSON Data');
  //  console.log(body);
  //  return body.data || { };
  //}

  //private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
  //  let errMsg: string;
  //  if (error instanceof Response) {
  //    const body = error.json() || '';
  //    const err = body.error || JSON.stringify(body);
  //    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //  } else {
  //    errMsg = error.message ? error.message : error.toString();
  //  }
  //  console.error(errMsg);
  //  return Observable.throw(errMsg);
  //}


  constructor(private CxService: ConexionService,
    private cd: ChangeDetectorRef,
    overlay: Overlay,
    vcRef: ViewContainerRef,
    public modal: Modal,
    private http: Http) {
    //Dlg.alert("YEAH");

    overlay.defaultViewContainer = vcRef;
    console.log('reading json config file');

    this.http.get('odoo-offline.json')
      .map(function() { console.log('Success'); });
      //.catch(function() {console.log('Error reading json');});

    /*this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title("CONTINUE?")
        .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
        .open();*/
  }

  get ConnData() {
    return this.CxService.ConnData;
  }

  openMenu() {
    console.log("openMenu");
  }

  closeMenu() {
    console.log("closeMenu");
  }

  Desconectar() {
    console.log("Desconectar");
    this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title("Desconectar")
        .body(`
            <h4>Al desconectarse no podrá sincronizar sus datos.</h4>
            <b>Desconección:</b>
            <ul>
              <li>${this.CxService.ConnData.host}:${this.CxService.ConnData.port}</li>
              <li>${this.CxService.ConnData.database}</li>
              <li>${this.CxService.ConnData.username}</li>
            </ul>`)
        .open();
    this.CxService.Desconectar();
  }

  Sincronizar() {
    console.log("Sincronizar");
  }

  ngOnInit() {

    console.log('[AppComponent] Subscribing...connectedOk$');

    this.cx_connectedOk_sub = this.CxService.connectedOk$.subscribe(
      connectedOk => {
        console.log(`[AppComponent] Received connectedOk: ${connectedOk}`);
        this.isConnected = connectedOk;
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

      this.cx_connectedServerString_sub = this.CxService.connectedServerString$.subscribe(
      connectedServerString => {
        console.log(`[AppComponent] Received connectedServerString: ${connectedServerString}`);
        this.connectedServerString = connectedServerString;
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_product_product_sub = this.CxService.pdb['product.product'].updated$.subscribe(
      (product_product_updated) => {
        console.log(`[AppComponent] Received updated: ${product_product_updated}`);
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

      this.cx_res_partner_sub = this.CxService.pdb['res.partner'].updated$.subscribe(
      (res_partner_updated) => {
        console.log(`[AppComponent] Received updated: ${res_partner_updated}`);
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_metodo_pago_sub = this.CxService.pdb['metodo.pago'].updated$.subscribe(
      (metodo_pago_updated) => {
        console.log(`[AppComponent] Received updated: ${metodo_pago_updated}`);
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_stock_location_sub = this.CxService.pdb['stock.location'].updated$.subscribe(
      (stock_location_updated) => {
        console.log(`[AppComponent] Received updated: $stock_location_updated}`);
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_product_pricelist_sub = this.CxService.pdb['product.pricelist'].updated$.subscribe(
      (stock_location_updated) => {
        console.log(`[AppComponent] Received updated: $product_pricelist_updated}`);
        //console.log(`[ProductPricelistComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_res_users_sub = this.CxService.pdb['res.users'].updated$.subscribe(
      (res_users_updated) => {
        console.log(`[AppComponent] Received updated: $res_users_updated}`);
        //console.log(`[ResUsersComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.cx_tickets_sub = this.CxService.pdb['tickets'].updated$.subscribe(
      (tickets_updated) => {
        console.log(`[AppComponent] Received updated: ${tickets_updated}`);
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        });

      this.timer = Observable.timer(15000,15000);
      // subscribing to a observable returns a subscription object
      this.sub = this.timer.subscribe(t => this.tickerFunc(t));

  }


  onClickCreateIndex() {
	var local_db = this.CxService.pdb['product.product']['db'];
        var myIndex = {
            _id: '_design/idx_default_code' ,
            views: {
			'idx_default_code': {
		            map: "function(doc) { emit(doc.default_code); }"
			}
		}
          }
	console.log('Va a crear el indice');
	local_db.put(myIndex).then((result) => {
		console.log('Creando indice',result);
		local_db.query('idx_default_code',{startkey: '140022', limit: 5, include_docs: true}).then((result) => {
			console.log('Resultado ', result);
			})
			.catch((err) => {
				console.log('No encontro',err);
				});
		})
		.catch((err) => {
			console.log('Error en creacion de indice ', err);
			local_db.query('idx_default_code_2',{startkey: '140022', limit: 5, include_docs: true}).then((result) => {
				console.log('Resultado ', result);
				})
				.catch((err) => {
					console.log('No encontro',err);
				});
			});
	var partner_db = this.CxService.pdb['res.partner']['db'];
        var myIndexPartner = {
            _id: '_design/idx_document_number' ,
            views: {
			'idx_document_number': {
		            map: "function(doc) { emit(doc.document_number); }"
			}
		}
          }
	console.log('Va a crear el indice #2');
	partner_db.put(myIndexPartner).then((result) => {
		console.log('Creando indice Partner',result);
		partner_db.query('idx_document_number',{startkey: '27262059', limit: 5, include_docs: true}).then((result) => {
			console.log('Resultado partner', result);
			})
			.catch((err) => {
				console.log('No encontro partner',err);
				});
		})
		.catch((err) => {
			console.log('Error en creacion de indice partner', err);
			partner_db.query('idx_document_number',{startkey: '27262059', limit: 5, include_docs: true}).then((result) => {
				console.log('Resultado partner', result);
				})
				.catch((err) => {
					console.log('No encontro partner',err);
				});
			});

	}

  toggleAutoSinc() {
    this.autoSinc = !this.autoSinc;
    this.cd.markForCheck();
    this.cd.detectChanges();
    console.log("toggleAutoSinc: this.autoSinc >", this.autoSinc);

  }

  toggleAutoSincClass() {
    if (this.autoSinc){
      return "fa fa-check-square-o";
    }
    return "fa fa-square-o";
  }


  ngOnDestroy() {
      this.cx_connectedOk_sub.unsubscribe();
      this.cx_connectedServerString_sub.unsubscribe();
      this.cx_product_product_sub.unsubscribe();
      this.cx_res_partner_sub.unsubscribe();
      this.cx_stock_location_sub.unsubscribe();
      this.cx_product_pricelist_sub.unsubscribe();
      this.cx_res_users_sub.unsubscribe();
      this.sub.unsubscribe();
    }

  classMessage() {
    if (this.isConnected) {
      return "alert alert-success";
    } else return "alert alert-warning";
  }

  tickerFunc( tick : any ) {
    this.ticks = tick;
    //if (this.autoSinc) {
    //  this.CxService.Conectar(this.CxService.ConnData);
    //}
      //console.log("AppComponent > this.CxService:", this.CxService);
  } // tickerFunc




} // Class AppComponent



