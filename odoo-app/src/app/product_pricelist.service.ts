import { Injectable } from '@angular/core';
import { ProductPricelist } from './product_pricelist';

@Injectable()
export class ProductPricelistService {

  lastId: number = 0;

  // Placeholder for todo's
  product_pricelist: ProductPricelist[] = [];

  constructor() { }

}
