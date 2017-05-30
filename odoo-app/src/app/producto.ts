
export class Producto {
  id: string = "";
  name: string = "";
  default_code: string = "";
  lst_price: number = 0.0;
  qty_available: number = 0;

  constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}
