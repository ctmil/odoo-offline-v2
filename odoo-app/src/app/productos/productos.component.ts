import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

interface IServerResponse {
    items: Object[];
    total: number;
}

import { ConexionService } from '../conexion.service'
import { ConexionData } from '../conexion-data'
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ProductosService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosComponent implements OnInit, OnDestroy {

  message = "Productos (...)"
  cx_productosDatabaseUpdated_sub: Subscription;
  table_id: string = "product.product";
  table_filters: any = [];
  table_fields: any = ['name','default_code','lst_price','qty_available'];
  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncProductos: Observable<Object[]>;
  Productos: any;
  temp_productos: Producto;
  ProductInfo: any;
  PriceInfo: any;
  StockInfo: any;
  data_productos: Producto[] = [];
  userFilter: any = {default_code : '', name : ''};

  constructor(private CxService: ConexionService, private cd: ChangeDetectorRef) {
		//this.PriceInfo = [
		//	{'pricelist_id': 'Mayorista','precio': 100},
		//	{'pricelist_id': 'Minorista','precio': 200},
		//	{'pricelist_id': 'e-commerce','precio': 300}
		//	];
		//this.StockInfo = [
		//	{'location_id': 'Neuquen','qty': 1000},
		//	{'location_id': 'Cipolletti','qty': 2000},
		//	{'location_id': 'Plottier','qty': 3000}
		//	];

    cd.detach();
    setInterval(() => {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }, 100);
  }

  getPage(event) {
    console.log("getPage " + this.table_id, " from:", this["p"], " to:", event);
    var page: number = event;
    this.loading = true;
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    this.asyncProductos = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncProductos");
      if (mytable) {

        for (var i = (pi - 1) * this.ipp; i < pi * this.ipp; i++) {
          if (mytable[i])
            if (mytable[i].key)
              mykeys.push(mytable[i].key);
        }

        console.log("mykeys:",mykeys);
        this.CxService.getDocs(this.table_id,
          { include_docs: true, keys: mykeys },
          (table_id, result) => {
            //console.log("bring page " + pi, result);
            const start = (pi - 1) * this.ipp;
            const end = start + this.ipp;

            for (var i = 0; i < this.ipp; i++) {
              var it = (pi - 1) * this.ipp + i;
              if (mytable[it]) {
                mytable[it] = new Producto(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "Productos ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();

  }

  ngOnInit() {

      console.log('Antes del all_docs productos');
      this.CxService.pdb["product.product"]["db"].allDocs({include_docs: true}).then((result) => {
        // handle result
        console.log("result:", result, this);
        this.data_productos = [];
        let docs = result.rows.map((row) => {
                   var temp_producto = new Producto();
                   temp_producto.id = row.doc.id;
                   temp_producto.name = row.doc.name;
                   temp_producto.default_code = row.doc.default_code;
                   temp_producto.lst_price = row.doc.lst_price;
                   temp_producto.qty_available = row.doc.qty_available;
                   this.data_productos.push(temp_producto);
         });
        });



    this.cx_productosDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[ProductosComponent] Received updated: ${updated}`, this.CxService.pdb['product.product']);
        //this.message = "Productos ("+this.total+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });
    // console.log('DEBUG Productos');
    this.Productos = this.CxService.pdb['product.product']['cache_records'];
    // console.log(this.Productos);

  }

  ngOnDestroy() {
    this.cx_productosDatabaseUpdated_sub.unsubscribe();
  }

	onClickStockPrices(parmProducto) {
		console.log(parmProducto);
		this.StockInfo = [];
		this.PriceInfo = [];
		// Prices
		var Prices = parmProducto.prices;
		var keys = Object.keys(Prices);
		for (var i = 0; i < keys.length; i++) {
			var vals = {
				// 'pricelist_id': keys[i].toString(),
				'pricelist_id': Prices[keys[i]][0],
				'precio': Prices[keys[i]][1].toString()
				}
			this.PriceInfo.push(vals);
			};
		// Stocks
		var Stocks = parmProducto.stock;
		this.ProductInfo = parmProducto;
		var keys = Object.keys(Stocks);
		for (var i = 0; i < keys.length; i++) {
			var valsStock = {
				// 'location_id': keys[i].toString(),
				'location_id': Stocks[keys[i]][0],
				'qty': Stocks[keys[i]][1].toString()
				}
			this.StockInfo.push(valsStock);
		};
	}

}
