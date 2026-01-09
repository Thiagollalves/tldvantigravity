import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private s3Client;
    private bucket;
    constructor(configService: ConfigService);
    getUploadUrl(key: string, contentType: string): Promise<string>;
    getDownloadUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
}
