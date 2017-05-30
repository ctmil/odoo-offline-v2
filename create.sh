#!/bin/sh
ng version
ng new odoo-app
cd odoo-app
ng generate class Tickets
ng generate service Tickets
ng generate component TicketsApp
