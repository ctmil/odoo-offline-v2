
export class ProductPricelist {
  id: string = "";
  name: string = "";

  constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}
