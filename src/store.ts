import fs from "node:fs";
import { Crypto } from "./crypto";

export class Store extends Crypto {
  private filePath: string;
  constructor() {
    super();
    this.filePath = `${__dirname}/token.json`;
  }
  public storeToken(token: string) {
    const encrypted = this.encrypt(JSON.stringify(token));
    fs.writeFileSync(this.filePath, JSON.stringify(encrypted));
  }

  public retrieveToken() {
    const encryptedData = JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    return JSON.parse(
      this.decrypt(encryptedData.encryptedData, encryptedData.iv)
    );
  }
}
