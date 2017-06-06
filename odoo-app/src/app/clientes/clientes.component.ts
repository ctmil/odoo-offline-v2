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

import { ConexionService } from '../conexion.service';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClientesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientesComponent implements OnInit,OnDestroy {

  message = "Clientes (...)"
  cx_clientesDatabaseUpdated_sub: Subscription;
  table_id: string = "res.partner";
  table_filters: any = [['is_company', '=', true], ['customer', '=', true]];
  table_fields: any = ['name', 'phone', 'email', 'comment','document_number'];
  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncClientes: Observable<Object[]>;
  Clientes: any;
  data_clientes: Cliente[] = [];
  userFilter: any = {document_number : '', name : ''};

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
    window["Clientes"] = this;

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

    this.asyncClientes = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncClientes");
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
                mytable[it] = new Cliente(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "Clientes ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();
  }

   ngOnInit() {

      console.log('Antes del all_docs res.partners');
      this.CxService.pdb["res.partner"]["db"].allDocs({include_docs: true}).then((result) => {
        // handle result
        this.data_clientes = [];
        let docs = result.rows.map((row) => {
                   var temp_cliente = new Cliente();
                   temp_cliente.id = row.doc.id;
                   temp_cliente.name = row.doc.name;
                   temp_cliente.document_number = row.doc.document_number;
                   temp_cliente.phone = row.doc.phone;
                   temp_cliente.email = row.doc.email;
                   this.data_clientes.push(temp_cliente);
         });
        });





    this.cx_clientesDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      lastmessage => {
        console.log(`[ClientesComponent] Subscribed received message: ${lastmessage}`);
        //this.message = "Clientes (" + this.CxService.pdb['res.partner']['count']
         // + "," + this.CxService.pdb['res.partner']['cache_records'].length + ")";
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });
    this.Clientes = this.CxService.pdb['res.partner']['cache_records'];

  }

  ngOnDestroy() {
    this.cx_clientesDatabaseUpdated_sub.unsubscribe();
  }

}
