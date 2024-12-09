import * as AWS from "aws-sdk";
const ssm = new AWS.SSM();

export const apiKey = {
  async getApiKey(): Promise<string> {
    const paramName = process.env.API_KEY || "";
    if (!paramName) {
      throw new Error("Environment variable API_KEY is required but not set.");
    }
    const response = await ssm.getParameter({ Name: paramName }).promise();
    // throw error if null
    if (!response.Parameter || !response.Parameter.Value) {
      throw new Error(
        `SSM parameter '${paramName}' is missing or has no value.`
      );
    }

    return response.Parameter.Value;
  },
};

export default apiKey;
