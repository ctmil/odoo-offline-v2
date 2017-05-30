import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Subscriber } from "rxjs/Subscriber";
import { Observer } from "rxjs/Observer";

import { TicketItem } from "../../ticket-item";
import { TicketItems } from "../../ticket-items";
import { Tickets } from "../../tickets";
import { Producto } from "../../producto";
import { ConexionService } from '../../conexion.service';


@Component({
  selector: 'ticket-items',
  templateUrl: './ticket-items.component.html',
  styleUrls: ['./ticket-items.component.css']
})

export class TicketItemsComponent implements OnInit {

  @Input() p_TicketItems: TicketItems;
  @Input() p_action: any;
  @Input() p_Ticket: Tickets;

  newItem: TicketItem = new TicketItem();
  editItem: TicketItem;
  data: any = [];
  excel_line_adder: boolean = false;
  addingitem : boolean = false;

  private _id: number = 0;
  constructor( private CxService: ConexionService,
  private cd: ChangeDetectorRef) {
  }

  ngOnInit() {}


  valueChanged(event) {
    console.log("valueChange:", event);
    console.log('p_Ticket',this.p_Ticket);
    this.newItem.product_name = event.doc.name;
    if (this.newItem.product_qty == undefined) 
	this.newItem.product_qty = 1;
    var pricelist = Number(this.p_Ticket.pricelist.id);
    var prices = event.value.prices;
    console.log('Prices',prices[pricelist]);
    this.newItem.product_unit_price = prices[pricelist][1];
  }
  myListFormatter(data: any): string {
      console.log("data:", data);
      return `(${data.id}) ${data.doc.default_code}-${data.doc.name}`;
  }

  myValueFormatter(data: any): string {
      console.log("value data:", data);
      return `${data.doc.default_code}`;
  }

  editTicketItem( Item : TicketItem ) {
    console.log("editTicketItem", Item);
    this.editItem = Item;
  }
  isEditing(Item: TicketItem) : boolean {
    if (this.editItem!=undefined && this.editItem.id == Item.id) {
      return true;
    }
    return false;
  }
  saveTicketItem(Item: TicketItem) {
    console.log("saveTicketItem", Item);
    //this.p_TicketItems.filter(item => item.id == Item.id)[0] = Item;
    this.editItem = undefined;
  }
  newTicketItem() {
    console.log("newTicketItem");
    this.newItem = new TicketItem();
    this.addingitem = true;

  }

  hideAddItem() {
    this.addingitem = false;
  }

  addTicketItem( Item : TicketItem ) {
    console.log("addTicketItem", Item);
    Item.id = this._id++;
    this.p_TicketItems.push(Item);
    if (this.excel_line_adder)
      this.newItem = new TicketItem();
    else
      this.addingitem = false;
  }
  get items_total() {
    var _items_total : number = 0;
      for (var itemid in this.p_TicketItems) {
        var Item: TicketItem = this.p_TicketItems[itemid];
        if (Number(Item.product_qty)>0 && Number(Item.product_qty)>0)
          _items_total += Number(Item.product_qty) * Number(Item.product_unit_price);
      }
      return _items_total;
  }


  myProducts(search_keyword) {
    console.log("searching products!", search_keyword, this);

    return Observable.create((subscriber: Subscriber<{}> )=> {

      console.log("subscriber", subscriber, this);
      // this.CxService.pdb["product.product"]["db"].query("idx_default_code",{startkey: search_keyword, limit: 5, include_docs: true
      // this.CxService.pdb["product.product"]["db"].find({ selector: {default_code: {$gte: search_keyword, limit: 5}}
      this.CxService.pdb["product.product"]["db"].find({ selector: {default_code: {$eq: search_keyword}, limit: 5}
      }).then((result) => {
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
	console.log('Por lo visto no encontro');
        console.log(err);
      });
      //observer.onCompleted();
      return () => console.log("disposed");
    });

  }


  removeTicketItem(removeItem: TicketItem) {
    console.log("removeTicketItem", removeItem);
    this.p_TicketItems.splice(this.p_TicketItems.indexOf(removeItem), 1);
  }
};
