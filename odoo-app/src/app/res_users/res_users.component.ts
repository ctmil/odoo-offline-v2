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
import { ResUsers } from '../res_users';
import { ResUsersService } from '../res_users.service';

@Component({
  selector: 'app-res_users',
  templateUrl: './res_users.html',
  styleUrls: ['./res_users.css'],
  providers: [ResUsersService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResUsersComponent implements OnInit, OnDestroy {

  message = "Vendedores"
  cx_res_users_DatabaseUpdated_sub: Subscription;
  table_id: string = "res.users";
  table_filters: any = [];
  table_fields: any = ['id','name'];
  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncResUsers: Observable<Object[]>;
  ResUsers: any;

  constructor(private CxService: ConexionService, private cd: ChangeDetectorRef) {
  	}

  getPage(event) {
    console.log("getPage " + this.table_id, " from:", this["p"], " to:", event);

    var page: number = event;
    this.loading = true;
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    this.asyncResUsers = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncResUsers");
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
                mytable[it] = new ResUsers(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "ResUsers ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();

  }


  ngOnInit() {

    this.cx_res_users_DatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[ResUsersComponent] Received updated: ${updated}`, this.CxService.pdb['res.users']);
        //this.message = "StockLocatioin ("+this.total+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });
    this.ResUsers = this.CxService.pdb['res.users']['cache_records'];
    // console.log('[DEBUG]');
    // console.log(this.StockLocation);
    this.getPage(1);

  }

  ngOnDestroy() {
    this.cx_res_users_DatabaseUpdated_sub.unsubscribe();
  }

}
