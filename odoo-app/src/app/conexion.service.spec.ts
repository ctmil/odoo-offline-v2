/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConexionService } from './conexion.service';

describe('ConexionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConexionService]
    });
  });

  it('should ...', inject([ConexionService], (service: ConexionService) => {
    expect(service).toBeTruthy();
  }));
});
