/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TicketsAppComponent } from './tickets-app.component';
import { FormsModule } from "@angular/forms";

describe('TicketsAppComponent', () => {
  let component: TicketsAppComponent;
  let fixture: ComponentFixture<TicketsAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TicketsAppComponent],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    let fixture = TestBed.createComponent(TicketsAppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
