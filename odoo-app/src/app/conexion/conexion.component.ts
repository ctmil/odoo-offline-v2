import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription }   from 'rxjs/Subscription';

import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { ConexionService } from '../conexion.service';
import { ConexionData } from '../conexion-data';

@Component({
  selector: 'app-conexion',
  templateUrl: './conexion.component.html',
  styleUrls: ['./conexion.component.css'],
  providers: [],
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConexionComponent implements OnInit, OnDestroy {

  str_verifique : string = "Por favor verifique sus datos de conexión.";
  message = "";
  isConnected = false;
  isErrorConnection = false;
  ConnData: ConexionData;

  cx_message_sub: Subscription;
  cx_connectedOk_sub: Subscription;

  constructor(private CxService: ConexionService, private cd: ChangeDetectorRef) {
    this.ConnData = CxService.ConnData;
    //this.isConnected = ;
  }

  classMessage() {
    if (this.isConnected) {
      return "alert alert-success";
    } else {
      return "alert alert-warning";
    }

  }

  ngOnInit() {
    console.log('[ConexionComponent] Subscribing...message$');
    this.cx_message_sub = this.CxService.message$.subscribe(
      lastmessage => {
        console.log(`[ConexionComponent] Subscribed received message: ${lastmessage}, from ${this.message}`);
        this.message = lastmessage;
        console.log(`[ConexionComponent] Subscribed saved message: to ${this.message}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

    console.log('[ConexionComponent] Subscribing...connectedOk$');
    this.cx_connectedOk_sub = this.CxService.connectedOk$.subscribe(
      connectedOk => {
        console.log(`[ConexionComponent] Subscribed received connectedOk: ${connectedOk}`);
        this.isConnected = connectedOk;
        if (connectedOk) {
        } else {
          this.message = this.str_verifique;
        }
        this.cd.markForCheck();
        this.cd.detectChanges();
      });

  }
  ngOnDestroy() {
    this.cx_message_sub.unsubscribe();
    this.cx_connectedOk_sub.unsubscribe();
  }

  Conectar(conexionData: ConexionData) {
    this.CxService.Conectar(conexionData);
  }

  cleanConexionData() {
    this.CxService.cleanConexionData();
  }

  generateConexionData() {
	console.log('[DEBUG] generate conection data');
	var PouchDB = require('pouchdb');
	var db = new PouchDB('metodo.pago');
	var doc = {
	  "_id": "CASH",
	  "name": "Efectivo",
	};
	db.put(doc);
	var doc = {
	  "_id": "CARD",
	  "name": "Tarjeta de Credito",
	};
	db.put(doc);
  }

}
