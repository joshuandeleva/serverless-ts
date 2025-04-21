import { Client } from "pg"

export const DBClient = async() => {
    return new Client({
        host: "127.0.0.1",
        user: "root",
        database: "user_service",
        password: 'root',
        port: 5434
    })
}