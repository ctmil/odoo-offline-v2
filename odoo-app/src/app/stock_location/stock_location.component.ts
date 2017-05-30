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
import { StockLocation } from '../stock_location';
import { StockLocationService } from '../stock_location.service';

@Component({
  selector: 'app-stocklocation',
  templateUrl: './stock_location.html',
  styleUrls: ['./stock_location.css'],
  providers: [StockLocationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockLocationComponent implements OnInit, OnDestroy {

  message = "Depósitos"
  cx_stock_location_DatabaseUpdated_sub: Subscription;
  table_id: string = "stock.location";
  table_filters: any = [];
  table_fields: any = ['id','name'];
  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncStockLocation: Observable<Object[]>;
  StockLocation: any;

  constructor(private CxService: ConexionService, private cd: ChangeDetectorRef) {
    /*
    this.CxService.getDocs( this.table_id, (res) => {
      if (this.CxService.pdb[this.table_id]["cache_records"].length==0) {
        this.CxService.fetchOdooTable(this.table_id,
          this.table_filters,
          this.table_fields,
          0,
          5000,
          () => {
            this.CxService.pdb[this.table_id].updated.next(true);
        });
      }

      this.CxService.pdb[this.table_id].updated.next(true);
    } );*/
  }

  getPage(event) {
    console.log("getPage " + this.table_id, " from:", this["p"], " to:", event);

    var page: number = event;
    this.loading = true;
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    this.asyncStockLocation = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncStockLocation");
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
                mytable[it] = new StockLocation(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "Stock Location ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();

  }


  ngOnInit() {

    this.cx_stock_location_DatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[StockLocationComponent] Received updated: ${updated}`, this.CxService.pdb['stock.location']);
        //this.message = "StockLocatioin ("+this.total+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });
    this.StockLocation = this.CxService.pdb['stock.location']['cache_records'];
    // console.log('[DEBUG]');
    // console.log(this.StockLocation);
    this.getPage(1);

  }

  ngOnDestroy() {
    this.cx_stock_location_DatabaseUpdated_sub.unsubscribe();
  }

}
