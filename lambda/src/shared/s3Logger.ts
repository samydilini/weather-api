import * as AWS from "aws-sdk";
const s3 = new AWS.S3();

export const s3Logger = {
  async printRequest(message: string) {
    try {
      this.print(message, `logs/${Date.now()}_request.log`);
      console.log(`Successfully uploaded the request to S3`);
    } catch (error) {
      console.error(`Failed to upload the request to S3`, error);
    }
  },
  async printResponse(message: string) {
    try {
      this.print(message, `logs/${Date.now()}_response.log`);
    } catch (error) {
      console.error(`Failed to upload the response to S3`, error);
    }
  },
  async print(message: string, key: string) {
    const bucket = process.env.BUCKET_NAME;

    if (!bucket) {
      throw new Error(
        "Environment variable BUCKET_NAME is required but not set."
      );
    }

    const s3Params = {
      Bucket: bucket,
      Key: key,
      Body: message,
      ContentType: "application/json",
    };

    await s3.putObject(s3Params).promise();
  },
};

export default s3Logger;
