export class ConexionData {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}
