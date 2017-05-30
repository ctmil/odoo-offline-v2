import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'ng2-config';
import { ConexionService } from '../conexion.service';

var PouchDB = require('pouchdb');

@Component({
  selector: 'app-syncro',
  templateUrl: './syncro.component.html',
  styleUrls: ['./syncro.component.css']
})
export class SyncroComponent implements OnInit {

	pdb: any = {};
	list_db: any = [];
	db: any;
	db_info: any;
	product_product: any;	
	remote_product_product: any;	

	constructor(private config: ConfigService,
		    private CxService: ConexionService) {
		}

	ngOnInit() {
		this.pdb = this.config.getSettings("databases");
		for (var dbindex in this.pdb) {
			this.list_db.push(this.pdb[dbindex]);
			if (this.pdb[dbindex].adapter == 'websql') {
				this.db = new PouchDB(this.pdb[dbindex].dbname, { "adapter": "websql" });
				}
			else {
				this.db = new PouchDB(this.pdb[dbindex].dbname) }
			var new_db = new PouchDB(this.pdb[dbindex].dbsync);
			new_db.info().then(function (remote_info) {
				console.log('Remote info ',remote_info);
				for (var i = 0; i < this.list_db.length; i++) {
					console.log('index');
					console.log(this.list_db[i]);
					//if (this.list_db[i].dbname == dbindex) {
					//	this.list_db[i].dbname['remote_count'] = remote_info.doc_count;
					//	};
					}
				});	
			}
		console.log('this.pdb');
 		}

	onClickSyncProductos() {
		console.log('onClickSyncProductos');
		this.product_product = new PouchDB('product_product', { "adapter": "websql" });
		this.remote_product_product = new PouchDB('http://52.67.49.208:5984/product.product');
		//this.remote_product_product.info().then(function(remote_info) {
		//	console.log('Remote info');
		//	console.log('Remoto ',remote_info);
		//	});
		this.product_product.replicate.from(this.remote_product_product).on('complete',function() {
			console.log('Yeah, we are in sync');
			}).on('error',function(err) {
				console.log('Yo, we got an error!!!',err);
			});
		}

	onClickQuery() {
		console.log('Click query');
		 this.CxService.pdb["res.partner"]["db"].query("idx_document_number",
		        { startkey: '82214796', limit: 5, include_docs: true }).then((result) => {
		        // handle result
		        console.log("resultado:", result, this);
        		});

		}

;}
