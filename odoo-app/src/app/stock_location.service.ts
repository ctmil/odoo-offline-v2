import { Injectable } from '@angular/core';
import { StockLocation } from './stock_location';

@Injectable()
export class StockLocationService {

  lastId: number = 0;

  // Placeholder for todo's
  stock_location: StockLocation[] = [];

  constructor() { }

}
