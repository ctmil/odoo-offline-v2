
export class TicketPayment {
  id: number;
  metodo_pago_id: number;
  metodo_pago_name: string;
  amount: number;

  constructor(values: Object = {}) {
   Object.assign(this, values);
  }
};


