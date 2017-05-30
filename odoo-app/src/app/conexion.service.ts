import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subject }    from 'rxjs/Subject';
import {  BehaviorSubject }    from 'rxjs/BehaviorSubject';

import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';
import { Tickets } from './tickets';
import { Producto } from './producto';
import { ProductosService } from './productos.service';
import { ConexionData } from './conexion-data';
import { ConfigService } from 'ng2-config';

var odooxmlrpc = require('odoo-xmlrpc');
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
PouchDB.debug.disable();

@Injectable()
export class ConexionService {


  private message = new BehaviorSubject("");
  message$ = this.message.asObservable();

  private connectedServerString = new BehaviorSubject("");
  connectedServerString$ = this.connectedServerString.asObservable();

  private connectedOk = new BehaviorSubject(false);
  connectedOk$ = this.connectedOk.asObservable();

  private databaseUpdated = new BehaviorSubject(false);
  databaseUpdated$ = this.databaseUpdated.asObservable();

  isErrorConnection: boolean;

  clientes: Cliente[];
  productos: Producto[];
  pdb : any = {};
  pdb_clientes: any = false;
  pdb_productos: any = false;
  pdb_tickets: any = false;
  remote: any = '';
  username: any = '';
  password: any = '';

  temp_ptab: any;

  ConnData: ConexionData = new ConexionData({
    host: "",
    port: "",
    database: "",
    username: "",
    password: ""
  });

  CouchConnData: ConexionData;

  dbsyncoptions: any = { live: true, retry: true };

  Ox = new odooxmlrpc({});

  constructor( private lSS: LocalStorageService, private config : ConfigService ) {

    console.log("ConexionService > constructor!",
      this.config.getSettings(),
      this.config.getSettings("auth", "couchdb"),
      this.config.getSettings("auth", "syncoptions"));

    if (lSS.isSupported) {
      //console.log("OK! local storage is supported!");
      var storageType = lSS.getStorageType();
      //console.log("storageType: " + storageType);
    }

    this.CouchConnData = new ConexionData( this.config.getSettings("auth", "couchdb"));
    this.ConnData = new ConexionData( this.config.getSettings("auth", "odoo"));
    console.log("ConexionService >  CouchConnData", this.CouchConnData);
    this.dbsyncoptions = this.config.getSettings("auth", "syncoptions");

    this.pdb = this.config.getSettings("databases");

    for (var dbindex in this.pdb) {

      var ptab = this.pdb[dbindex];
      var ptableid = ptab['dbname'];
      if (ptab['adapter']) ptab['db'] = new PouchDB(ptableid, { "adapter": ptab['adapter']});
      else ptab['db'] = new PouchDB(ptableid);
      ptab['dbsync'] =  this.CouchConnData.host + ":"
        + this.CouchConnData.port + "/"
        + ptab['dbsyncname'];
      ptab['updated'] = new BehaviorSubject("");
      ptab['cache_records'] = [];
      ptab['lastsync'] = '';
      ptab['filtersearch'] = '';
      ptab['count'] = 0;
      ptab.updated$ = ptab.updated.asObservable();
      ptab.db.sync(ptab.dbsync, this.dbsyncoptions).on('change',
        (change) => {
          // yo, something changed!
          console.log("something changed", change, dbindex);
        }).on('paused', (info) => {
          // replication was paused, usually because of a lost connection
          console.log("replication paused", info, dbindex);
        }).on('active', (info) => {
          // replication was resumed
          console.log("replication resumed", info, dbindex);
        }).on('error', (err) => {
          // totally unhandled error (shouldn't happen)
          console.log("replication error", err, dbindex);
        }).on('complete', (info) => {
          // replication was canceled!
          console.log("replication was completed", info, dbindex);
        });

      ptab.db.changes({
        since: 'now'
      }).on('change', (change) => {
        // received a change
        console.log("received a change", change);
      }).on('error', (err) => {
        // handle errors
        console.log("received a error", err);
      });

      ptab.db.info().then((result) => {
        console.log("Db Info:", result);
      });

      //if (ptab["indexes"]) {
      //  for (var idx in ptab["indexes"]) {
//
//          console.log("Checking index:", idx );
//
//          var field_name = ptab['indexes'][idx]["field"];
//
//          ptab['indexes'][idx] = {
//            _id: '_design/' + idx,
//            views: {}
//          }
//
//	  if (field_name == 'default_code') {
//	          ptab['indexes'][idx].views[idx] = {
//			'idx_default_code': {
  //      		    map: "function(doc) { emit(doc."+field_name+"); }"
//		          }
//			}
//		}
//	  else {
//	          ptab['indexes'][idx].views[idx] = {
  //      		    map: "function(doc) { emit(doc."+field_name+"); }"
//			}
//		}
//	  this.temp_ptab = ptab['indexes'][idx];
//	  console.log('DEBUG');
//	  console.log(ptab['indexes']);
//	  console.log(idx);
  //        ptab.db.get("_design/"+idx).then((result) => {
    //        console.log("index already exists: ", result);
//          }).catch((err) => {
 //           console.log("Create index: ", idx, err);
//	    console.log('Va a crear el indice #1', this.temp_ptab);
  //          // ptab.db.put(ptab['indexes'][idx]).then((result) => {
    //        ptab.db.put(this.temp_ptab).then((result) => {
      //        console.log("Added index " + idx, result);
        //      return ptab.db.query(idx, { stale: 'update_after' });
//            }).catch((error) => {
  //            console.log("index already exist?", error);
    //        });
      //    });
//        }
  //    }
      /**/
      this.getInfo( ptableid, (table_id,res) => {
        var p = this.pdb[table_id];
        p['cache_records'] = new Array(p['count']);
        console.log("Info fecthed for " + table_id, res, p);
        this.getDocs( p['dbname'], {include_docs: false},(table_id, res) => {
          console.log("Loaded db:", table_id);
          this.pdb[table_id].updated.next("Fetched info and records ids about "+table_id);
        });
      });
    }

    console.log("ConexionService > created db tables: ", this.pdb);

    var local_db = this.pdb['product.product']['db'];
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
            })
           .catch((err) => {
                   console.log('Error en creacion de indice ', err);
                    });
    var partner_db = this.pdb['res.partner']['db'];
    var product_db = this.pdb['product.product']['db'];
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
                })
           .catch((err) => {
                   console.log('Error en creacion de indice partner', err);
                   });


     console.log('Creando Mango Index');
     partner_db.createIndex({
             index: {fields: ['document_number']}
            }).then( () => {
                  console.log('Indice Mango creado');
             })
              .catch( (err) => {
                    console.log('Error creando indice Mango',err);
               });

     console.log('Creando Mango Index - Products');
     product_db.createIndex({
            index: {fields: ['default_code']}
            }).then( () => {
                console.log('Indice Mango creado product');
            })
            .catch( (err) => {
                 console.log('Error creando indice Mango product',err);
            });


    this.fetchConexionData();
    this.Conectar(this.ConnData);
    console.log("ConexionService > constructor end!", this);
    window["Cx"] = this;
  }

  getInfo(table_id: string, callback?:any) {
    this.pdb[table_id]['db'].info().then((result) => {
      // handle result
      this.pdb[table_id]['count'] = result.doc_count;
      if (callback) callback(table_id,result);
    }).catch((err)=> {
      console.log(err);
    });
  }

  isConnected() {
    return this.connectedOk.getValue();
  }

  submit(key, val) {
    return this.lSS.set(key, val);
  }

  getItem(key) {
    return this.lSS.get(key);
  }

  setItem(key, val) {
    return this.lSS.set(key, val);
  }

  removeItem(key) {
    return this.lSS.remove(key);
  }

  //...
  removeItems(key1, key2, key3) {
    return this.lSS.remove(key1, key2, key3);
  }

  getKeys() {
    var lsKeys = this.lSS.keys();
    return lsKeys;
  }

  setTableRecord( table_id, key_id, record ) {
    if (table_id in this.pdb) {
      record["_id"] = key_id;
      this.saveDoc( table_id, record, (response) => console.log("saveDoc! ok!", response));
      return;
    }

    var table_hash = this.getTable(table_id);
    //console.log("table_hash:", table_hash, typeof table_hash);
    if (key_id == undefined) key_id = record['id'];
    if (key_id == undefined) key_id = record['_id'];
    if (key_id == undefined) key_id = record['name'];
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  setTableRecords(table_id : string, key_id_name: any, records : any ) {

    if (table_id in this.pdb) {
      this.saveDocs(table_id, key_id_name, records, 0, (response) => {

        console.log("saveDoc > Finalized!!!", response, key_id_name );

        this.getDocs(table_id, {include_docs: false}, (result) => {
          this.pdb[table_id].updated.next("getting docs after saved");
          this.databaseUpdated.next(true);
        });

      });
      return;
    }

    for (var i in records) {
      var record = records[i];
      this.setTableRecord( table_id, record[key_id_name], record );
    }
  }


  getTableRecord(table_id, key_id) {
    var table_hash = this.getTable(table_id);
    return table_hash[key_id];
  }

  addTableRecord( table_id , key_id, record ) {
    var table_hash = this.getTable(table_id);
    table_hash[key_id] = record;
    this.setTable( table_id, table_hash );
  }

  getClientes(callback) {
    return this.getDocs('res.partner', {include_docs: false},callback );
  }

  removeDoc(table_id: string, record_id: string, callback?: any) {

    this.pdb[table_id]['db'].get(record_id).then( (res_doc) => {
      console.log("CxService::getDoc > found! deleting", res_doc);
      this.pdb[table_id]['db'].remove(res_doc);
      if (callback) callback(res_doc);
      //return res_doc;
    }).catch((err1) => {

      if (err1.name === 'not_found') {
        console.log("CxService::getDoc > not found!", record_id)
        if (callback) callback(err1);
        return;
      }
      if (callback) callback(err1);

    });
  }

  getDoc(table_id: string, record_id: string, callback?:any) {

    this.pdb[table_id]['db'].get(record_id).catch((err1) => {

      if (err1.name === 'not_found') {
        console.log("CxService::getDoc > not found!", record_id)
        if (callback) callback(err1);
        return;
      }
      if (callback) callback(err1);

    }).then( (res_doc) => {
      console.log("CxService::getDoc > found!", res_doc);
      if (callback) callback(res_doc);
      return res_doc;
    });

  }


  // getDocs( table_id, options, callback ) {
  getDocs( table_id, options, callback?:any ) {
    console.log(`CxService::getDocs(${table_id}) options: ${JSON.stringify(options)}`);

    var docs = this.pdb[table_id]['db'].allDocs(options).then((result) => {
      console.log("getDocs>", table_id, result);
      if (result.rows && options["include_docs"]==false)
        this.pdb[table_id]['cache_records'] = result.rows;
      /*
      for (var row in result.rows) {
        var R: any = result.rows[row]['doc'];
        if (table_id == "tickets") {
          var T: Tickets = new Tickets(R);
          this.pdb[table_id]['cache_records'].push( T );
        } else
          this.pdb[table_id]['cache_records'].push( R );
      }
      */
      if (callback) callback(table_id,result);

    }).catch(function(err) {

      console.log(`CxService::getDocs(${table_id}) > error calling allDocs`, err);
      if (callback) callback(err);

    });

    return docs;

  }

  saveClientes(key_id_name: any, records: any, offset: any, callback: any) {
    this.saveDocs('res.partner', key_id_name, records, offset, callback );
  }

  setId( key_id_name: any, record: any ) {
    if (typeof key_id_name == 'string')
      return  record[key_id_name];
    if (key_id_name.length > 0) {
      var key = "";
      var sep = "";
      for( var n in key_id_name) {
        key = key+sep+key_id_name[n]+"_"+record[key_id_name[n]];
        sep = "_";
      }
      return key;
    }
  }

  saveDocs( table_id: string, key_id_name: any, records: any, offset: any, callback: any ) {
    if (offset == undefined) offset = 0;
    var record = records[offset];
    if (record) {
      record["_id"] = this.setId( key_id_name, record );
      //if (offset==0) console.log(`saveDocs(${table_id}) >> N:${records.length}`, records, key_id_name);
      if (offset == 0) console.log(`saveDocs(${table_id}) >> N:${records.length}`);
      offset = offset + 1;
      if (offset < records.length) {
        this.saveDoc(table_id, record, (response) => {
          this.saveDocs(table_id, key_id_name, records, offset, callback);
        });
      } else {
        this.saveDoc(table_id, record, (response) => {
          var r = {
            processed: offset,
            total: records.length,
            record: response
          };
          if (callback) callback(r);
        });
      }
    }
  }

  saveCliente(cliente: any, callback: any) {
    this.saveDoc('res.partner', cliente, callback);
  }

  saveDoc( table_id: string, doc: any, callback: any) {

    console.log(`CxService::saveDoc(${table_id},${doc._id})`);
    if (this.pdb[table_id]["key_name"]) {
      var key_id_name = this.pdb[table_id]["key_name"];
      if (doc["_id"]==undefined) {
        doc["_id"] = this.setId(key_id_name, doc);
        console.log("key_id_name: ",key_id_name);
      }
    }
    console.log(`CxService::saveDoc(${table_id},${doc._id})`);
    this.pdb[table_id]['db'].get(doc["_id"]).catch( (err1) => {

      if (err1.name === 'not_found') {

        //console.log("CxService::saveDoc > ok not found create it!", doc["_id"], err.name);

        this.pdb[table_id]['db'].put(doc).then((response) => {

          console.log(`CxService::saveDoc(${table_id},${doc._id}) > posted !!`,this);
          this.pdb[table_id]['cache_records'].push(doc);
          if (callback) callback(response);

        }).catch(function(err) {
          //console.log("CxService::saveDoc > created error:", err);
          if (callback) callback(err);
        });
      } else { // hm, some other error
        console.log("CxService::saveDoc > get error: ", doc["_id"], err1 );
        //throw err;
        if (callback) callback(err1);
      }
    }).then((result_doc) => {
      // sweet, here is our configDoc
      //assign same "_rev"
      if (result_doc) {
        //console.log("CxService::saveDoc get founded! Next?", result_doc["_id"], result_doc);
        doc["_rev"] = result_doc["_rev"];
        //console.log("CxService::saveDoc > update it! With:", cliente, self.pdb_clientes);
        this.pdb[table_id]['db'].put(doc).then((response) => {

          console.log(`CxService::saveDoc > updated !! ${doc._id}`, this);
          for( var i in this.pdb[table_id]['cache_records'] ) {
            var r = this.pdb[table_id]['cache_records'][i];
            if (r._id == doc._id) {
              this.pdb[table_id]['cache_records'][i] = doc;
              console.log(`CxService::saveDoc > cache_records updated !! ${doc._id}`);
            }
          }
          if (callback) callback(response);

        }).catch(function(err) {

          console.log("CxService::saveDoc > updated error:", doc, err);
          if (callback) callback(err);

        });
      }

    }).catch((err) => {
      // handle any errors
      console.log("CxService::saveDoc > get error: ", err, " doc:", doc);
      if (callback) callback(err);
    });

/**
    */
  }

  deleteCliente(cliente: any) {
    return this.pdb_clientes.remove(cliente);
  }

  updateCliente(cliente: any) {
    return this.pdb_clientes.put(cliente);
  }

  getProductos() {
/*
    var docs = this.pdb_productos.allDocs({
      include_docs: true
    });
    return docs;*/

  }

saveProducto(producto: any) {
    return this.pdb_productos.put(producto);
  }

  deleteProducto(producto: any) {
    return this.pdb_productos.remove(producto);
  }

  updateProducto(producto: any) {
    return this.pdb_productos.put(producto);
}




  // returns table hash { "key_id_1": {record_1}, "key_id_2": {record_2}, ... }
  getTable( table_id ) {
    var table_hash_string = this.getItem(table_id);
    //var table_hash_string = this.getItem(table_id);
    //console.log('table_hash_string of ', table_id, table_hash_string, typeof table_hash_string);
    //var table_hash = JSON.parse( table_hash_string );
    var table_hash = table_hash_string;
    //console.log('table_hash of ', table_id, table_hash );
    if (table_hash==undefined || table_hash==null || table_hash_string=="") {
      table_hash = {};
    }
    if (typeof table_hash == "string") {
      table_hash = JSON.parse(table_hash);
    }
    //console.log("getTable > table_hash:", table_hash, typeof table_hash);
    return table_hash;
  }

  getTableAsArray( table_id: string ) : any {
    var table_array: Cliente[] = [];

    if (table_id in this.pdb) {
      return this.pdb[table_id]["cache_records"];
    }

    var table_hash = this.getTable(table_id);

    for (var key_id in table_hash) {
      table_array.push(table_hash[key_id]);
    }
    return table_array;

  }

  setTable(table_id, table_hash) {
    //var table_hash_string = JSON.stringify(table_hash);
    var table_hash_string = table_hash;
    this.setItem(table_id, table_hash_string );
  }

  fetchPartners(callback) {
    this.fetchOdooTable("res.partner",
      [['is_company', '=', true], ['customer', '=', true]],
      ['name', 'phone', 'email', 'comment','document_number'],
      0,
      1000,
      callback);
    /*
      var Osx = this.Ox;
      var self = this;
      Osx.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(['name', 'phone', 'email', 'comment']); //fields
          inParams.push(0); //offset
          inParams.push(5); //limit
          var params = [];
          params.push(inParams);
          Osx.execute_kw('res.partner', 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
              for ( var rec in value) {
                console.log('Record: rec:', rec, value[rec]);
                var record = value[rec];
                self.setTableRecord("res.partner", record['name'], record);
              }

              if (callback) callback();
          });
      });
*/
  }

  fetchProducts(callback) {
    this.fetchOdooTable("product.product",
      [],//['is_company', '=', true], ['customer', '=', true]
      ['name','default_code','lst_price','qty_available'],
      0,
      5000,
      callback);
  }

  // table_id = 'res.partner'
  // search_params = [['is_company', '=', true],['customer', '=', true]]
  // search_fields = ['name', 'phone', 'email', 'comment']
  // offset = 0
  // limit = 5
  fetchOdooTable( table_id, search_params, search_fields, offset, limit, callback ) {
      var Osx = this.Ox;
      var self = this;
      Osx.connect(function (err) {
          if (err) {
            self.isErrorConnection = true;
            self.message = err;
            return console.log(err);
          }
          //console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push(search_params);
          inParams.push(search_fields); //fields
          inParams.push(offset); //offset
          inParams.push(limit); //limit
          var params = [];
          params.push(inParams);
          Osx.execute_kw( table_id, 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              //console.log('Result: ', value);
              /**
              for ( var rec in value) {
                //console.log('Record: rec:', rec, value[rec]);
                var record = value[rec];
                self.setTableRecord( table_id, record['name'], record);
              }
              */
              var records = value;
              self.setTableRecords( table_id, self.pdb[table_id]['key_name'], records);

              if (callback) callback();
          });
      });

  }

  checkConexion(callback) {
    this.fetchConexionData();
    var self = this;
    var connparams = {
      url: this.ConnData.host,
      port: this.ConnData.port,
      db: this.ConnData.database,
      username: this.ConnData.username,
      password: this.ConnData.password
    };
    this.Ox = new odooxmlrpc(connparams);
    this.Ox.connect(callback);
  }

  Conectar(conexionData: ConexionData) {
    if (conexionData && conexionData!=null) {
      console.log("Conectando >>>>>>>>> ");
      var self = this;
      var connparams = {
        url: conexionData.host,
        port: conexionData.port,
        db: conexionData.database,
        username: conexionData.username,
        password: conexionData.password
      };
      this.Ox = new odooxmlrpc(connparams);
      this.Ox.connect(function(err) {
        if (err) {
          self.message.next("Error de conexión, intente de nuevo.");
          self.connectedServerString.next("Desconectado");
          self.connectedOk.next(false);
          return console.log("ConexionService ERROR:", err);
        }
        console.log('>>>>>>>>> Connected to Odoo server!! Saving parameters');
        self.message.next("Conectado al servidor.");
        self.connectedServerString.next("Conectado");
        //self.isConnected = true;
        self.connectedOk.next(true);
        self.saveConexionData();
      });
    } else {
      this.message.next("Debe completar todos los campos.");
    }
  }

  Desconectar() {
    this.connectedOk.next(false);
  }

  cleanConexionData() {
    console.log("cleanConexionData");
    this.ConnData = new ConexionData({
      host: "",
      port: "",
      database: "",
      username: "",
      password: ""
    });
    this.removeItem('OdooParams');
    this.connectedOk.next(false);
    this.message.next("Se limpiaron los datos de conexión, reingrese los datos por favor.");

  }


  fetchConexionData() {
    var conndata = this.getItem('OdooParams');
    if (conndata && conndata != null) {
      console.log("fetchConexionData > conndata is an object", conndata, typeof conndata);
      if (conndata["host"]) {
        this.ConnData = new ConexionData(conndata);
        return console.log("fetchConexionData found:", this.ConnData);
      }
    }
    console.log("fetchConexionData not found:", this.ConnData);
  }

  saveConexionData() {
    this.setItem('OdooParams',this.ConnData);
    //console.log("saveConexionData:", this.ConnData);
  }

  /*
      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push('read');
          inParams.push(false); //raise_exception
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'check_access_rights', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(10); //offset
          inParams.push(5);  //limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search_count', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });


      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(0);  //offset
          inParams.push(1);  //Limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search', params, function (err, value) {
              if (err) { return console.log(err); }
              var inParams = [];
              inParams.push(value); //ids
              var params = [];
              params.push(inParams);
              Ox.execute_kw('res.partner', 'read', params, function (err2, value2) {
                  if (err2) { return console.log(err2); }
                  console.log('Result: ', value2);
              });
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([]);
          inParams.push([]);
          inParams.push([]);
          inParams.push(['string', 'help', 'type']);  //attributes
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'fields_get', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });

      Ox.connect(function (err) {
          if (err) { return console.log(err); }
          console.log('Connected to Odoo server.');
          var inParams = [];
          inParams.push([['is_company', '=', true],['customer', '=', true]]);
          inParams.push(['name', 'country_id', 'comment']); //fields
          inParams.push(0); //offset
          inParams.push(5); //limit
          var params = [];
          params.push(inParams);
          Ox.execute_kw('res.partner', 'search_read', params, function (err, value) {
              if (err) { return console.log(err); }
              console.log('Result: ', value);
          });
      });
*/
      //var client = xmlrpc.createClient({ host: this.host, port: this.port, path: '/start' });
      /*
      client.methodCall('xmlrpc/2/common', [], function (error, value) {
        if (error) {
          console.log('error:', error);
          console.log('req headers:', error.req && error.req._header);
          console.log('res code:', error.res && error.res.statusCode);
          console.log('res body:', error.body);
        } else {
          console.log('value:', value);
        }
      });*/
/*
      var json = JSON.stringify({ params: params });
      console.log("json",json);

        var options = {
          host: this.host,
          port: this.port,
          path: '/web/session/authenticate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Content-Length': json.length,
          }
        };
//            'mode': 'no-cors'


        console.log("Starting http request (options): ", options );
        var req = https.request(options, function (res) {
          var response = '';
          console.log("http.request>res:",res);
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
            response += chunk;
          });

          res.on('end', function () {
            response = JSON.parse(res);
            console.log(response);
            //if (response.error) {
              //return cb(response.error, null);
            //}

//            this.uid = this.response.result.uid;
//            this.sid = res.headers['set-cookie'][0].split(';')[0];
//            this.session_id = this.response.result.session_id;
//            this.context = this.response.result.user_context;

            //return cb(null, response.result);

          });
        });
        console.log("Writing using http request:",req);
        req.write(json);
        req.end();
*/

}
