import axios from "axios";
import Logger from "./shared/logger";
import S3Logger from "./shared/s3Logger";
import ApiKey from "./shared/apiKey";

export const handler = async (event: any): Promise<any> => {
  const city: string = event.pathParameters.city;

  const message = "Current weather request for " + city;
  Logger.info(message);

  S3Logger.printRequest(message);

  try {
    const apiKey: string = await ApiKey.getApiKey();
    const url: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get<WeatherApiResponse>(url);

    const message = "Current weather response for " + city;
    Logger.info(message);

    S3Logger.printResponse(message);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Specify allowed methods
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
