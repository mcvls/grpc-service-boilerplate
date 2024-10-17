import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionHelper {
  private key;
  private algorithm = 'aes-256-cbc'; //Using AES encryption

  constructor(configService: ConfigService) {
    this.key = configService.get('KEY');
  }

  decrypt(encryptedData?: string) {
    if (!encryptedData) return '';
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const iv =
      this.key.substring(0, 10) + this.key.substring(this.key.length - 6);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
