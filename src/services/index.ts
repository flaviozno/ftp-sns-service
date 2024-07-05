import { Client as FTPClient } from "basic-ftp";
import csvParser from "csv-parser";
import fs from "fs";
import * as path from "path";

class FTPService {
  private client: FTPClient;

  constructor() {
    this.client = new FTPClient();
  }

  async connect(host: string, user: string, password: string) {
    try {
      await this.client.access({
        host,
        user,
        password,
        secure: false,
      });
      console.log("Connected to FTP server");
    } catch (error) {
      console.log("Failed to connect to FTP server");
    }
  }

  async downloadFile(filePath: string): Promise<void> {
    const localFilePath = path.resolve(__dirname, "../download/ftp-data.csv");
    const writableStream = fs.createWriteStream(localFilePath);
    await this.client.downloadTo(writableStream, filePath);
  }

  async parseCSV(
    localPath: string
  ): Promise<{ name: string; phone: string }[]> {
    const results: { name: string; phone: string }[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(localPath)
        .pipe(csvParser({ mapHeaders: ({ header }) => header.toLowerCase() }))
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }

  close() {
    this.client.close();
  }
}

export default FTPService;
