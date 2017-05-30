


export class TicketItem {
  id: number;
  product_id: number;
  product_name: string;
  product_qty: number;
  product_unit_price: number;

  constructor(values: Object = {}) {
   Object.assign(this, values);
  }
};


