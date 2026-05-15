export interface User {

    id_user: number;
    name: string;
    email: string;
    password: string;
    role: number;
    hierarchy: number;
    active: boolean;
    register_date: Date;
    last_login: Date;

}