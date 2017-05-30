import { Injectable } from '@angular/core';
import { Tickets } from './tickets';
import { TicketItem } from './ticket-item';
import { TicketItems } from "./ticket-items";
import { TicketPayment } from './ticket-payment';
import { TicketPayments } from "./ticket-payments";
import { ConfigService } from 'ng2-config';

import { ConexionService } from './conexion.service';

@Injectable()
export class TicketsService {

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 0;
  table_id: string = "tickets";

  // Placeholder for todo's
  tickets: Tickets[] = [];

  constructor(private CxService: ConexionService,
              public config: ConfigService) {
    this.fetchTickets();
  }

  fetchTickets(callback?:any) {
/*
    this.CxService.getDocs(this.table_id, {include_docs:false}, (table_id,res) => {
      console.log("TicketsService > ", this.CxService.pdb[this.table_id]);
      if (callback) callback(res);
    });*/

  }



  // Simulate POST /todos
  addTicket(ticket: Tickets, callback?: any): TicketsService {
    var point_of_sale = this.config.getSettings("point_of_sale", "number");
    var today = new Date();
    var new_id = point_of_sale + today.toISOString();

    ticket.id = new_id;
    ticket.printed_date = today.toISOString();
    ticket.printed_date = ticket.printed_date.substring(0,10);
	console.log('addTicket',ticket);
    //if (!ticket.id) {
    //  ticket.id = ++this.lastId;
    //}
    this.tickets.push(ticket);

    if (String(ticket.client).trim() == '') {
      return;
    }

    this.CxService.saveDoc("tickets", ticket, (res) => {
      if ("error" in res) {
        if (res.error) {
          console.error("Ticket addition error", res);
          if (callback) callback(res);
          return;
        }
      }
      console.log("Ticket addition ok", res);

      if (callback) callback(res);
      //this.CxService.getDoc()
    } );


    return this;
  }

  deleteTicketById(ticket_id: any, callback?: any) {
    this.CxService.removeDoc("tickets", ticket_id, (res) => {
      if ("error" in res) {
        if (res.error) {
          console.error("Ticket removal error", res);
          if (callback) callback(res);
          return;
        }
      }
      console.log("Ticket removal ok", res);

      if (callback) callback(res);
      //this.CxService.getDoc()
    } );
  }
  // Simulate DELETE /todos/:id
  deleteTicket(ticket: Tickets, callback?: any) {
    this.deleteTicketById(ticket["_id"], callback);
  }
  // Simulate PUT /todos/:id
  updateTicketById(id: string, values: Object = {}): Tickets {
    let ticket = this.getTicketById(id);
    if (!ticket) {
      return null;
    }
    Object.assign(ticket, values);
    return ticket;
  }

  // Simulate GET /todos
  getAllTickets(): Tickets[] {
    return this.CxService.getTableAsArray('tickets');
    //return this.tickets;
  }

  // Simulate GET /todos/:id
  getTicketById(id: string): Tickets {
    return this.tickets
      .filter(ticket => ticket.id === id)
      .pop();
  }


}
