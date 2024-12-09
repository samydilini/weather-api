import axios from "axios";
import * as AWS from "aws-sdk";
const ssm = new AWS.SSM();
import Logger from "./shared/logger";
import S3Logger from "./shared/s3Logger";
import ApiKey from "./shared/apiKey";

export const handler = async (event: any): Promise<any> => {
  const city: string = event.pathParameters.city;

  const message = "current weather request for " + city;
  Logger.info(message);

  try {
    S3Logger.printRequest(message);
    console.log(`Successfully uploaded the request to S3`);
  } catch (error) {
    console.error(`Failed to upload the request to S3`, error);
  }

  //add a try catch and 500 in catch
  const apiKey: string = await ApiKey.getApiKey();
  return {
    statusCode: 200,
    body: JSON.stringify("in current" + apiKey),
  };
  // const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // try {
  //   const response = await axios.get<WeatherApiResponse>(url);

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(response.data),
  //   };
  // } catch (error: any) {
  //   return {
  //     statusCode: error.response?.status || 500,
  //     body: JSON.stringify({ error: error.message }),
  //   };
  // }
};
