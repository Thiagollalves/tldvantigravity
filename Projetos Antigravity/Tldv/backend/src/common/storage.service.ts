import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
    private s3Client: S3Client;
    private bucket: string;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get('S3_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY')!,
                secretAccessKey: this.configService.get('S3_SECRET_KEY')!,
            },
            endpoint: this.configService.get('S3_ENDPOINT'),
            forcePathStyle: true, // Needed for MinIO and some local S3 alternatives
        });
        this.bucket = this.configService.get<string>('S3_BUCKET')!;
    }

    async getUploadUrl(key: string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async getDownloadUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return this.s3Client.send(command);
    }
}
