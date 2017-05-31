import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresorasComponent } from './impresoras.component';

describe('ImpresorasComponent', () => {
  let component: ImpresorasComponent;
  let fixture: ComponentFixture<ImpresorasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpresorasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpresorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
