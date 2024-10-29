import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class EncryptionHelper {
  private key;
  private algorithm = 'aes-256-cbc'; //Using AES encryption
  private iv;

  constructor(configService: ConfigService) {
    this.key = configService.get('KEY');
    this.iv =
      this.key.substring(0, 10) + this.key.substring(this.key.length - 6);
  }

  encrypt(data: string): string {
    let cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
  }

  decrypt(encryptedData?: string) {
    if (!encryptedData) return '';
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  encryptEnv() {
    const content = fs.readFileSync('.env', 'utf-8');
    const lines = content.toString().split('\n');
    const myObj: any[] = [];
    for (let line = 0; line < lines.length; line++) {
      const currentline = lines[line].split('=');
      const key = currentline[0].trim().replace(/["]/g, '');
      const includedKeys = [
        'DB_USER',
        'DB_PASSWORD',
        'REDIS_USER',
        'REDIS_PASSWORD',
        'RABBITMQ_USER',
        'RABBITMQ_PASSWORD',
        'DD_APP_KEY',
        'DD_API_KEY',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'KAFKA_USER',
        'KAFKA_PASSWORD',
      ];
      if (includedKeys.indexOf(key) > -1)
        myObj.push({
          key: key,
          value: currentline[1].trim().replace(/["]/g, ''),
        });
    }

    const encrypted = fs.createWriteStream('.env.encrypted');
    myObj.forEach((x) => {
      const value = this.encrypt(x.value);
      encrypted.write(x.key + '=' + value + '\n');
    });
    encrypted.write('KEY=' + this.key + '\n');
    encrypted.end();
  }

  decryptEnv() {
    const content = fs.readFileSync('.env', 'utf-8');
    const lines = content.toString().split('\n');
    const myObj: any[] = [];
    for (let line = 0; line < lines.length; line++) {
      const currentline = lines[line].split('=');
      const key = currentline[0].trim().replace(/["]/g, '');
      const includedKeys = [
        'DB_USER',
        'DB_PASSWORD',
        'REDIS_USER',
        'REDIS_PASSWORD',
        'RABBITMQ_USER',
        'RABBITMQ_PASSWORD',
        'DD_APP_KEY',
        'DD_API_KEY',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'KAFKA_USER',
        'KAFKA_PASSWORD',
      ];
      if (includedKeys.indexOf(key) > -1)
        myObj.push({
          key: key,
          value: currentline[1].trim().replace(/["]/g, ''),
        });
    }

    const encrypted = fs.createWriteStream('.env.decrypted');
    myObj.forEach((x) => {
      const value = this.decrypt(x.value);
      encrypted.write(x.key + '=' + value + '\n');
    });
    encrypted.write('KEY=' + this.key + '\n');
    encrypted.end();
  }
}
