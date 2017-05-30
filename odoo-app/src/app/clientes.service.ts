import { Injectable } from '@angular/core';
import {Cliente} from './cliente';

@Injectable()
export class ClientesService {

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 0;

  // Placeholder for todo's
  clientes: Cliente[] = [];

  constructor() {
  }
/*
  // Simulate POST /todos
  addCliente(ticket: Tickets): TicketsService {
    if (!ticket.id) {
      ticket.id = ++this.lastId;
    }
    this.tickets.push(ticket);
    return this;
  }

  // Simulate DELETE /todos/:id
  deleteTicketById(id: number): TicketsService {
    this.tickets = this.tickets
      .filter(ticket => ticket.id !== id);
    return this;
  }

  // Simulate PUT /todos/:id
  updateTicketById(id: number, values: Object = {}): Tickets {
    let ticket = this.getTicketById(id);
    if (!ticket) {
      return null;
    }
    Object.assign(ticket, values);
    return ticket;
  }

  // Simulate GET /todos
  getAllTickets(): Tickets[] {
    return this.tickets;
  }

  // Simulate GET /todos/:id
  getTicketById(id: number): Tickets {
    return this.tickets
      .filter(ticket => ticket.id === id)
      .pop();
  }

  // Toggle todo complete
  toggleTicketComplete(ticket: Tickets){
    let updatedTicket = this.updateTicketById(ticket.id, {
      complete: !ticket.complete
    });
    return updatedTicket;
  }*/

}
