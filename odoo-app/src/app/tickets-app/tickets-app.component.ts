import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Subscription }   from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { Tickets } from '../tickets';
import { TicketItem } from '../ticket-item';
import { TicketItems } from "../ticket-items";
import { TicketPayment } from '../ticket-payment';
import { TicketPayments } from "../ticket-payments";
import { TicketsService } from '../tickets.service';
import { ConexionService } from '../conexion.service';
import { Cliente } from "../cliente";
import { Producto } from "../producto";

@Component({
  selector: "tickets-app",
  templateUrl: "./tickets-app.component.html",
  styleUrls: ["./tickets-app.component.css"],
  providers: [TicketsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TicketsAppComponent implements OnInit {

  message = "Tickets";
  cx_productosDatabaseUpdated_sub: Subscription;
  newTicket: Tickets = new Tickets();
  action: string = "";
  subparam: Subscription;
  search_clientes: BehaviorSubject<Object[]>;
  search_sellers: BehaviorSubject<Object[]>;
  search_pricelists: BehaviorSubject<Object[]>;
  data: any = [];
  data_tickets: Tickets[] = [];
  deleting_item: boolean = false;
  deleting_ticket: any;
  table_id: string = "tickets";
  ticketFilterToday: any = { 
		printed_date: '',	
		};	
  ticketFilterPrinted: any = { 
		ticket_printed: undefined,
		};	
  ticketFilterPaid: any = { 
		ticket_paid: undefined,
		};	

  ipp: number = 5;
  p: number;
  total: number;
  loading: boolean = false;
  asyncTickets: Observable<Object[]>; 
  myTickets: any;

  constructor(
    private ticketsService: TicketsService,
    private CxService: ConexionService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef) {
	this.newTicket.date = new Date();
  }

  onNotify( event : any ) {
    console.log("TicketsAppComponent > onNotify");
  }

	printTicket() {
		this.newTicket.ticket_printed = true;
		}

  addTicket() {
    if (this.newTicket.items.length > 0) {
	    this.ticketsService.addTicket(this.newTicket, (res) => {
	      this.cd.markForCheck();
	      this.cd.detectChanges();
	      //this.newTicket = new Tickets();
	      this.router.navigate(['/tickets']);
	    });
	}
  }

  deletingItem(id) {
    this.deleting_item = true;
    this.deleting_ticket = id;
  }

  deleteItem() {
    this.removeTicketById(this.deleting_ticket);
    this.deleting_item = false;
  }

  cancelDeleteItem() {
    this.deleting_item = false;
    this.deleting_ticket = undefined;
  }

  removeTicketById(id) {
    this.ticketsService.deleteTicketById(id, (res) => {
      this.cd.markForCheck();
      this.cd.detectChanges();
      console.log(res);
      //this.newTicket = new Tickets();
      //this.router.navigateByUrl("/tickets");
      this.message = "Ticket Eliminado";
    });
  }

  removeTicket(ticket) {
    this.removeTicketById(ticket["_id"]);
  }

  get tickets() {
    //console.log("calling tickets!", this.ticketsService.getAllTickets());
    //return this.ticketsService.getAllTickets();
    return this.CxService.getTableAsArray('tickets')
  }

  valueChanged(event) {
    console.log("valueChange:", event);
    this.newTicket.client = event.doc.name;
    this.newTicket.client_id = event.doc;
  }
  myListFormatter(data: any): string {
      console.log("data:", data);
      return `(${data.id}) ${data.doc.document_number} - ${data.doc.name} - ${data.doc.email}`;
  }

  myValueFormatter(data: any): string {
      console.log("value data:", data);
      return `${data.doc.document_number}`;
  }

  misClientes(search : string) {
    console.log("misClientes search:", search);

    if (search.length > 2) {
      /*this.CxService.getDocs("res.partner",
        { include_docs: true, key: search }, (table_id, result) => {
        console.log("Result from search: ", search, result);
      });*/
      //var myId = 'foo';

    }
  }

  myClients(search_keyword) {
    //var clientes = ["Juan","Pedro","Miguel","Lucia","Lucia Sola"];
    /*var allobjects = this.CxService.getTableAsArray("res.partner")
    for( let idx in allobjects) {
      var cli : Cliente = allobjects[idx];
      clientes.push(cli.name+" "+cli.document_number);
    }*/
    //console.log("get myClients", this.search_clientes);
    //return this.search_clientes;
    console.log("searching clients!", search_keyword, this);

    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);

      this.CxService.pdb["res.partner"]["db"].query("idx_document_number",
        { startkey: search_keyword, limit: 5, include_docs: true }).then((result) => {
        // handle result
        console.log("resultado:", result, this);
        this["data"] = [];
        let docs = result.rows.map((row) => {
          row.value = row.doc;
          this.data.push(row);
          //observer.onNext(this["data"]);
        });
        console.log("Data:",this.data);
        subscriber.next( this.data );
            /*this.search_clientes = [];
        if (result.rows) {
          for (var i in result.rows) {
            this.search_clientes.push(result.rows[i].id);
          }
        }
        console.log("this.search_clientes:", this.search_clientes);*/
        this.cd.markForCheck();
        this.cd.detectChanges();

        return result.rows;

      }).catch(function(err) {
        console.log(err);
      });
      //observer.onCompleted();
      return () => console.log("disposed");
    });

  }

  getPage(event) {
    console.log("getPage " + this.table_id, " from:", this["p"], " to:", event);
    var page: number = event;
    this.loading = true;
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    var pi = Number(event);
    var mykeys = [];
    var mytable = this.CxService.pdb[this.table_id]['cache_records'];

    this.asyncTickets = Observable.create((subscriber: Subscriber<{}>) => {
      console.log("checking asyncTickets");
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
            console.log("bring page " + pi, result);
            const start = (pi - 1) * this.ipp;
            const end = start + this.ipp;

            for (var i = 0; i < this.ipp; i++) {
              var it = (pi - 1) * this.ipp + i;
              if (mytable[it] && result.rows[i] != null) {
                mytable[it] = new Tickets(result.rows[i].doc);
                mytable[it].id = result.rows[i].id;
                mytable[it].key = result.rows[i].key;
              }
            }
            //console.log("bring page mytable now is:", mytable, mytable.length);
            this["p"] = pi;
            this.loading = false;
            this.total = mytable.length;
            this.message = "Tickets ("+this.total+")";
            subscriber.next( mytable.slice(start, end) );
          });
      }
    });

    this.cd.markForCheck();
    this.cd.detectChanges();

  }

  mySellers(search_keyword) {
    console.log("searching sellers!", search_keyword, this);

    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);

      this.CxService.pdb["res.users"]["db"].allDocs({include_docs: true}).then((result) => {
        // handle result
        console.log("result:", result, this);
        this["data"] = [];
        let docs = result.rows.map((row) => {
		console.log('DEBUG');
		if ( search_keyword == '') {
	          row.value = row.doc.name;
	          this.data.push(row);
		} 
		else {
			var row_value = row.doc.name;
			if (row_value.startsWith(search_keyword)) {
				row.value = row.doc.name;
			        this.data.push(row);
			}
		};
		console.log(this.data);
          //observer.onNext(this["data"]);
        });
        subscriber.next( this.data );
            /*this.search_clientes = [];
        if (result.rows) {
          for (var i in result.rows) {
            this.search_sellers.push(result.rows[i].id);
          }
        }
        console.log("this.search_sellers:", this.search_sellers);*/
        this.cd.markForCheck();
        this.cd.detectChanges();
        return result.rows;
      }).catch(function(err) {
        console.log(err);
      });
      //observer.onCompleted();
      return () => console.log("disposed");
    });

  }

  myPricelists(search_keyword) {
    console.log("searching pricelists!", search_keyword, this);
    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);

      this.CxService.pdb["product.pricelist"]["db"].allDocs({include_docs: true}).then((result) => {
        // handle result
        console.log("result:", result, this);
        this["data"] = [];
        let docs = result.rows.map((row) => {
		console.log('DEBUG');
		if ( search_keyword == '') {
	          row.value = row.doc.name;
	          this.data.push(row);
		} 
		else {
			var row_value = row.doc.name;
			if (row_value.startsWith(search_keyword)) {
				row.value = row.doc.name;
			        this.data.push(row);
			}
		};
		console.log(this.data);
          //observer.onNext(this["data"]);
        });
        subscriber.next( this.data );
            /*this.search_clientes = [];
        if (result.rows) {
          for (var i in result.rows) {
            this.search_pricelists.push(result.rows[i].id);
          }
        }
        console.log("this.search_pricelists:", this.search_pricelists);*/
        this.cd.markForCheck();
        this.cd.detectChanges();
        return result.rows;
      }).catch(function(err) {
        console.log(err);
      });
      //observer.onCompleted();
      return () => console.log("disposed");
    });

  }

	onClickNotPrinted() {
		console.log('Clickeo no impreso');
		this.ticketFilterPrinted.ticket_printed = false;
		this.ticketFilterToday.printed_date = '';
		this.ticketFilterPaid.ticket_paid = undefined;
		}

	onClickNotPaid() {
		console.log('Clickeo filtro impago');
		this.ticketFilterPaid.ticket_paid = false;
		this.ticketFilterPrinted.ticket_printed = undefined;
		this.ticketFilterToday.printed_date = '';
		}

	onClickToday() {
		console.log('Clickeo filtro hoy');
		this.ticketFilterToday.printed_date = new Date().toISOString().substr(0,10);
		this.ticketFilterPaid.ticket_paid = undefined;
		this.ticketFilterPrinted.ticket_printed = undefined;
		console.log(this.ticketFilterToday);
		}

  ngOnInit() {

      console.log('Antes del all_docs tickets');
      this.CxService.pdb["tickets"]["db"].allDocs({include_docs: true}).then((result) => {
        // handle result
        console.log("result:", result, this);
        this.data_tickets = [];
        let docs = result.rows.map((row) => {
		   var temp_ticket = new Tickets();
		   temp_ticket.id = row.doc.id;
		   temp_ticket.client = row.doc.client;
		   temp_ticket.seller = row.doc.seller;
		   temp_ticket.items = row.doc.items;
		   // temp_ticket.amount = row.doc.amount;
		   temp_ticket.date = row.doc.date;
		   temp_ticket.payments = row.doc.payments;
		   temp_ticket.ticket_printed = row.doc.ticket_printed;
		   temp_ticket.printed_date = row.doc.printed_date;
                   this.data_tickets.push(temp_ticket);
         });
	});

      this.cx_productosDatabaseUpdated_sub = this.CxService.pdb[this.table_id].updated$.subscribe(
      updated => {
        console.log(`[ProductosComponent] Received updated: ${updated}`, this.CxService.pdb['tickets']);
        //this.message = "Productos ("+this.total+")";
        //console.log(`[ProductosComponent] Subscribed saved message: to ${lastmessage}`);
        this.cd.markForCheck();
        this.cd.detectChanges();
        this.getPage(1);
      });

    console.log("TicketsComponent > subparam", this.subparam);
    if (this.subparam == undefined) {
      this.subparam = this.route.params.subscribe(data => {
        console.log("TicketsComponent > param data received!", data);
        var id = data["id"];
        if (id) {
          this.CxService.getDoc("tickets", id, (response) => {
            if ("error" in response) {
              console.log("Errors in edit:", response);
            } else {
              console.log(this.action + " OK >>>", response);
              this.newTicket = new Tickets(response);
              if (this.newTicket["items"] == undefined) {
                this.newTicket.items = [];
              }
              this.cd.markForCheck();
              this.cd.detectChanges();
            }
          });
        } else {
          this.getPage(1);
        }
      });

      console.log("TicketsComponent > route params subscribed!", this.subparam);
    }
/**this.route.params
    // (+) converts string 'id' to a number
    .switchMap((params: Params) => this.service.getHero(+params['id']))
    .subscribe((hero: Hero) => this.hero = hero); */

    console.log("route:", this.route, this.route.snapshot.data);
    if ("action" in this.route.snapshot.data) {
      this.action = this.route.snapshot.data["action"];
      if (this.action == "new") {
        this.message = "Nuevo Ticket";
      }

      if (this.action == "view") {
        this.message = "Viendo Ticket";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
      }

      if (this.action == "edit") {
        this.message = "Editando Ticket";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
      }

      if (this.action == "delete") {
        this.message = "Eliminando Ticket!!";
        console.log("this.route.params:", this.route.params, this.route.snapshot.params);
      }

    } else {
      this.action = "";

    }
  }

  ngOnDestroy() {
    this.cx_productosDatabaseUpdated_sub.unsubscribe();
  }
}
