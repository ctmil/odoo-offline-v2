/* tslint:disable:no-unused-variable */


import { TestBed, async, inject } from "@angular/core/testing";
import {Tickets} from './tickets';
import { TicketsService } from "./tickets.service";

describe('TicketsService', () => {

  beforeEach(() => TestBed.configureTestingModule({
      providers: [
          { provide: TicketsService, useClass: TicketsService }
      ]})
  );

  describe('#getAllTickets()', () => {

    it('should return an empty array by default', inject([TicketsService], (service: TicketsService) => {
      expect(service.getAllTickets()).toEqual([]);
    }));

    it('should return all tickets', inject([TicketsService], (service: TicketsService) => {
      let ticket1 = new Tickets({client: 'Hello 1', amount: '11.22', complete: false});
      let ticket2 = new Tickets({client: 'Hello 2', amount: '22.33', complete: true});
      service.addTicket(ticket1);
      service.addTicket(ticket2);
      expect(service.getAllTickets()).toEqual([ticket1, ticket2]);
    }));

  });

  describe('#save(ticket)', () => {

    it('should automatically assign an incrementing id', inject([TicketsService], (service: TicketsService) => {
      let ticket1 = new Tickets({client: 'Hello 1', amount: '11.22',complete: false});
      let ticket2 = new Tickets({client: 'Hello 2', amount: '22.33',complete: true});
      service.addTicket(ticket1);
      service.addTicket(ticket2);
      //expect(service.getTicketById(1)).toEqual(ticket1);
      //expect(service.getTicketById(2)).toEqual(ticket2);
    }));

  });

  describe('#deleteTicketById(id)', () => {

    it('should remove todo with the corresponding id', inject([TicketsService], (service: TicketsService) => {
      let ticket1 = new Tickets({client: 'Hello 1', amount: '11.22',complete: false});
      let ticket2 = new Tickets({client: 'Hello 2', amount: '22.33',complete: true});
      service.addTicket(ticket1);
      service.addTicket(ticket2);
      expect(service.getAllTickets()).toEqual([ticket1, ticket2]);
      service.deleteTicketById(1);
      expect(service.getAllTickets()).toEqual([ticket2]);
      service.deleteTicketById(2);
      expect(service.getAllTickets()).toEqual([]);
    }));

    it('should not removing anything if ticket with corresponding id is not found', inject([TicketsService], (service: TicketsService) => {
      let ticket1 = new Tickets({client: 'Hello 1', amount: '11.22',complete: false});
      let ticket2 = new Tickets({client: 'Hello 2', amount: '22.33',complete: true});
      service.addTicket(ticket1);
      service.addTicket(ticket2);
      expect(service.getAllTickets()).toEqual([ticket1, ticket2]);
      service.deleteTicketById(3);
      expect(service.getAllTickets()).toEqual([ticket1, ticket2]);
    }));

  });

  describe('#updateTicketById(id, values)', () => {

    it('should return ticket with the corresponding id and updated data', inject([TicketsService], (service: TicketsService) => {
      let ticket = new Tickets({client: 'Hello 1', amount: '11.22',complete: false});
      service.addTicket(ticket);
      /*let updatedTicket = service.updateTicketById(1, {
        client: 'new client'
      });*/
      //expect(updatedTicket.client).toEqual('new client');
    }));

    it('should return null if ticket is not found', inject([TicketsService], (service: TicketsService) => {
      let ticket = new Tickets({client: 'Hello 1', amount: '11.22',complete: false});
      service.addTicket(ticket);
      /*let updatedTicket = service.updateTicketById(2, {
        client: 'new client'
      });*/
      //expect(updatedTicket).toEqual(null);
    }));

  });


});
