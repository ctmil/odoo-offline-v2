import { TicketItem } from "./ticket-item";
import { TicketItems } from "./ticket-items";
import { TicketPayment } from "./ticket-payment";
import { TicketPayments } from "./ticket-payments";

export class Tickets {
    id: string = '';
    date: Date;
    //amount: number = 0;
    client_dni: string = '';
    client_id: any;
    client: string = '';
    seller: string = '';
    ticket_printed: boolean = false;
    printed_date: string = '';
    //complete: boolean = false;
    items: TicketItems = [];
    pricelist: any;
    payments: TicketPayments = [];
    // error_message
    //error_message: string = '';

    //private _items_total : number = 0;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    get ticket_day(): number {
	if (this.date) {
		var return_value = this.date.getDate();
		return return_value;
		}
	else {
		return 0;
		}
	}

    get ticket_month(): number {
	if (this.date) {
		return this.date.getMonth();
		}
	else {
		return 0;
		}
	}

    get ticket_year(): number {
	if (this.date) {
		return this.date.getFullYear();
		}
	else {
		return 0;
		}
	}

    get amount() : number {
      //console.log("calculating amount of ", this);
      var _items_total : number = 0;
      for (var itemid in this.items) {
        var Item: TicketItem = this.items[itemid];
        if (Number(Item.product_qty)>0 && Number(Item.product_unit_price)>0)
          _items_total += Number(Item.product_qty) * Number(Item.product_unit_price);
      }
      return _items_total;
    }

		get residual_amount(): number {
			let return_value = 0;
			for (var item_id in this.items) {
        var Item: TicketItem = this.items[item_id];
				return_value = return_value + Number(Item.product_qty) * Number(Item.product_unit_price);
				}
			for (var payment_id in this.payments) {
        var Payment: TicketPayment = this.payments[payment_id];
				return_value = return_value - Number(Payment.amount);
				}
			return return_value;
			}

	get ticket_paid(): boolean {
		if (this.residual_amount > 0) {
			return false;
		} else {
			return true;
			}
		}
	

    isValid(): boolean {
      if (this.date == null) {
        //this.error_message = 'Debe ingresarse la fecha';
        return false;
      }
      // Validates date is greater than yesterday
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.date <= yesterday) {
        //this.error_message = 'La fecha debe ser el día de hoy';
        return false;
      }
      if (this.client == null) {
        //this.error_message = 'Debe ingresarse el cliente';
        return false;
      }
      if (this.items == null || this.items.length == 0) {
        //this.error_message = 'Debe ingresarse al menos un producto';
        return false;
      }
      for (var itemid in this.items) {
        var Item: TicketItem = this.items[itemid];
        if (Number(Item.product_qty) <= 0 || Number(Item.product_unit_price) <= 0) {
          //this.error_message = 'El importe o cantidad debe ser mayor a 0';
          return false;
          }
        }

      return true;
    }


}
