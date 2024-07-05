import { AppDataSource } from "../database";
import { Client } from "../entities/Clients";
import FTPService from "../services/index";
import AWS from "aws-sdk";
import * as path from "path";
import { validatePhoneNumber } from "../utils/index";

const getCurrentHour = (): number => new Date().getHours();

const saveToDatabase = async (
  clients: { name: string; phone: string }[]
): Promise<void> => {
  const clientRepository = AppDataSource.getRepository(Client);

  for (const clientData of clients) {
    const client = new Client();
    if (validatePhoneNumber(clientData.phone)) {
      client.name = clientData.name;
      client.phone = clientData.phone;
      await clientRepository.save(client);
    }
  }
};

const sendMessage = (
  SNS: AWS.SNS,
  phone: string,
  message: string,
  delaySeconds = 0
): Promise<AWS.SNS.PublishResponse> => {
  const params = {
    Message: message,
    PhoneNumber: phone,
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };
  console.log(message, phone)

  if (delaySeconds > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        SNS.publish(params).promise().then(resolve).catch(reject);
      }, delaySeconds * 1000);
    });
  }

  return SNS.publish(params).promise();
};

const sendMessages = (
  SNS: AWS.SNS,
  clients: { name: string; phone: string }[]
): void => {
  const currentHour = getCurrentHour();
  const delaySeconds = currentHour >= 20 ? (24 - currentHour + 8) * 3600 : 0;

  for (const client of clients) {
    const { name, phone } = client;
    const message = `Ola ${name}, essa mensagem foi enviada via AMAZON SNS pelo FLÁVIO FILHO!`;
    sendMessage(SNS, phone, message, delaySeconds);
  }
};

const ftpService = new FTPService();

export const handler = async (
  SNS: AWS.SNS
): Promise<{
  statusCode: number;
  body: string;
}> => {
  try {
    await ftpService.connect(
      process.env.FTP_HOST || "locahost",
      process.env.FTP_USER || "user",
      process.env.FTP_PASSWORD || "password"
    );

    await ftpService.downloadFile("./clients_data.csv");

    const localFilePath = path.resolve(__dirname, "../download/ftp-data.csv");
    let clients = await ftpService.parseCSV(localFilePath);
    await saveToDatabase(clients);
    sendMessages(SNS, clients);
    return { statusCode: 200, body: "Success" };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    ftpService.close();
  }
};
