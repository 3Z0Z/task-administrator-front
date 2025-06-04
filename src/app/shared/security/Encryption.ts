import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environments';

export default class Encryption {

  private static readonly secretKey = environment.secret_key;
  private static readonly encryptIv = environment.encryptIv;
  
  public static encryptPassword(password: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(Encryption.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(Encryption.encryptIv);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), secretKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

}