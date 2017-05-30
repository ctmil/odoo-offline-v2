/* tslint:disable:no-unused-variable */
///<reference path="../../typings/globals/jasmine/index.d.ts"/>

import { FormsModule } from "@angular/forms";

import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { TicketsAppComponent } from "./tickets-app/tickets-app.component";


describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TicketsAppComponent,
      ],
      imports: [
        FormsModule,
      ],
    });
    TestBed.compileComponents();
  });

  it("should create the app", async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Odoo-offline App'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("Odoo-offline App");
  }));

  it("should render title in a h1 tag", async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain("Odoo-offline App");
  }));
});
