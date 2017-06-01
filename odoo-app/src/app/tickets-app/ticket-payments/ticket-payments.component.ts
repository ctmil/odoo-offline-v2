import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Tickets } from "../../tickets";
import { TicketPayment } from "../../ticket-payment";
import { TicketPayments } from "../../ticket-payments";
import { Producto } from "../../producto";
import { ConexionService } from '../../conexion.service';


@Component({
  selector: 'ticket-payments',
  templateUrl: './ticket-payments.component.html',
  styleUrls: ['./ticket-payments.component.css']
})

export class TicketPaymentsComponent implements OnInit {

  @Input() p_Ticket: Tickets;
  @Input() p_TicketPayments: TicketPayments;
  @Input() p_action: any;

  newPayment: TicketPayment = new TicketPayment();
  editPayment: TicketPayment;
  data: any = [];
  excel_line_adder: boolean = false;
  addingpayment : boolean = false;
  // search_metodos_pago: BehaviorSubject<Object[]>;
  search_metodos_pago: any;

	error_message: string = '';

  private _id: number = 0;

  constructor( private CxService: ConexionService, private cd: ChangeDetectorRef) {
	  }

  ngOnInit() {
		}

	onKeyPress(parm: any) {
		this.error_message = '';
		}

  valueChanged(event) {
    console.log("valueChange:", event);
    this.newPayment.metodo_pago_name = event.doc.name;
    if (this.newPayment.amount == undefined) this.newPayment.amount = 0;
    // this.newItem.product_unit_price = event.doc.lst_price;
  }
  myListFormatter(data: any): string {
      console.log("data:", data);
      return `(${data.id}) - ${data.doc.name}`;
  }

  myValueFormatter(data: any): string {
      console.log("value data:", data);
      return `${data.doc.id}`;
  }

  editTicketPayment( Payment : TicketPayment ) {
    console.log("editTicketPayment", Payment);
    this.editPayment = Payment;
  }
  isEditing(Payment: TicketPayment) : boolean {
    if (this.editPayment!=undefined && this.editPayment.id == Payment.id) {
      return true;
    }
    return false;
  }
  saveTicketPayment(Payment: TicketPayment) {
    console.log("saveTicketPayment", Payment);
    //this.p_TicketItems.filter(item => item.id == Item.id)[0] = Item;
    this.editPayment = undefined;
  }
  newTicketPayment() {
    console.log("newTicket");
    console.log(this.p_Ticket);
    console.log("newTicketPayment");
    console.log(this.p_TicketPayments);
    this.newPayment = new TicketPayment();
		this.newPayment.amount = this.p_Ticket.residual_amount;
    this.addingpayment = true;
  }

  hideAddPayment() {
    console.log('hideAddPayment');
    this.addingpayment = false;
  }

  addTicketPayment( Payment : TicketPayment ) {
    console.log("addTicketPayment", Payment);
		if (this.p_Ticket.residual_amount < Payment.amount) {
			this.error_message = 'Monto del pago supera el residual';
			}
		else {
	    Payment.id = this._id++;
  	  this.p_TicketPayments.push(Payment);
    	if (this.excel_line_adder)
      	this.newPayment = new TicketPayment();
	    else
  	    this.addingpayment = false;
			}
  }

  get payments_total() {
    var _payments_total : number = 0;
      for (var paymentid in this.p_TicketPayments) {
        var Payment: TicketPayment = this.p_TicketPayments[paymentid];
        if (Number(Payment.amount)>0)
          _payments_total += Number(Payment.amount);
      }
      return _payments_total;
  }

  // myMetodosPago

  myMetodosPago(search_keyword) {
    console.log("searching metodos pago!", search_keyword, this);
    return Observable.create((subscriber: Subscriber<{}> )=> {
      this.data = [];
      this.search_metodos_pago = [];
      console.log("subscriber", subscriber, this);
      this.CxService.pdb["metodo.pago"]["db"].allDocs({include_docs: true}).then((result) => {
        console.log("resultado:", result, this);
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
        if (result.rows) {
          for (var i in result.rows) {
            this.search_metodos_pago.push(result.rows[i].id);
          }
        }
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

  removeTicketPayment(removePayment: TicketPayment) {
    console.log("removeTicketPayment", removePayment);
    this.p_TicketPayments.splice(this.p_TicketPayments.indexOf(removePayment), 1);
  }
};
