import { Inject, Injectable, Logger } from '@nestjs/common';
import { AWSOptions } from './aws-options.type';
import { AWS_CONFIG_OPTIONS } from './aws-options.type';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mime from 'mime-types';
import {
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectRequest,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export default class AWSService {
  private s3Client: S3Client;
  constructor(@Inject(AWS_CONFIG_OPTIONS) private options: AWSOptions) {
    this.s3Client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
  ): Promise<boolean> {
    try {
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: buffer,
      });

      await this.s3Client.send(putObjectCommand);
      return true;
    } catch (error) {
      Logger.error('Unable to upload file to S3. Error: ' + error);
      return false;
    }
  }

  async getUrl(
    bucket: string,
    internalFileName: string,
    downloadFileName?: string,
  ): Promise<string> {
    try {
      const headObjectInput: HeadObjectRequest = {
        Bucket: bucket,
        Key: internalFileName,
      };
      const headObjectCommand = new HeadObjectCommand(headObjectInput);
      await this.s3Client.send(headObjectCommand);

      const getObjectInput = {
        Bucket: bucket,
        Key: internalFileName,
        ResponseContentDisposition: `attachment; filename=${
          downloadFileName ?? internalFileName
        }`,
        ResponseContentType: mime.lookup(internalFileName),
        Expires: 60, //seconds
      };
      const getObjectCommand = new GetObjectCommand(getObjectInput);

      const url = await getSignedUrl(this.s3Client, getObjectCommand);

      return url;
    } catch (error) {
      Logger.error(
        'Unable to get S3 file url ' + internalFileName + '. Error: ' + error,
      );
      return null;
    }
  }
}
