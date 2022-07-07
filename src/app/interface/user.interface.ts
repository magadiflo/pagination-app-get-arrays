export interface User {
    id:       number;
    name:     string;
    email:    string;
    status:   Status;
    address:  string;
    phone:    string;
    imageUrl: string;
}

export enum Status {
    active = 'ACTIVE',
    banned = 'BANNED',
    pending = 'PENDING'
}