import { Injectable } from '@angular/core';
import { ResUsers } from './res_users';

@Injectable()
export class ResUsersService {

  lastId: number = 0;

  // Placeholder for todo's
  res_users: ResUsers[] = [];

  constructor() { }

}
