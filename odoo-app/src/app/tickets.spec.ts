/* tslint:disable:no-unused-variable */
///<reference path="../../typings/globals/jasmine/index.d.ts"/>

import {Tickets} from './tickets';

describe('Tickets', () => {

  it('should create an instance', () => {
    expect(new Tickets()).toBeTruthy();
  });

  it('should accept values in the constructor', () => {
    let tickets = new Tickets({
      id: '234',
      date: new Date(),
      client: 'NewClient',
      seller: 'NewSeller',
    });
    expect(tickets.client).toEqual('NewClient');
    expect(tickets.seller).toEqual('NewSeller');
    expect(tickets.id).toEqual('234');
    //expect(tickets.date).toEqual(234);
  });

});
