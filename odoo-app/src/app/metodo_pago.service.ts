import { Injectable } from '@angular/core';
import { MetodoPago } from './metodo_pago';

@Injectable()
export class MetodoPagoService {

  lastId: number = 0;

  // Placeholder for todo's
  metodos_pago: MetodoPago[] = [];

  constructor() { }

}
