export class Cliente {
    id: number;
    name: string;
    phone: string;
    email: string;
    document_number: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
