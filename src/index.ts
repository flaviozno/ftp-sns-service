import "reflect-metadata";
import { AppDataSource } from "./database/index";
import { handler } from "./controllers/index";
import "dotenv/config";
import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.REGION_AWS,
  accessKeyId: process.env.PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

const SNS = new AWS.SNS();

AppDataSource.initialize()
  .then(() => {
    console.log("Success to connect to the database!");
    handler(SNS);
  })
  .catch((error) => {
    console.log("Error to connect to the database!", error);
  });
