import "reflect-metadata";
import { DataSource } from "typeorm";
import { Client } from "../entities/Clients";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: "database",
  synchronize: true, //set false to prod
  logging: false,
  entities: [Client],
  migrations: [],
  subscribers: [],
});
