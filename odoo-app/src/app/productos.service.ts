import { Injectable } from '@angular/core';
import { Producto } from './producto';

@Injectable()
export class ProductosService {

  lastId: number = 0;

  // Placeholder for todo's
  productos: Producto[] = [];

  constructor() { }

}
