import axios from "axios";

interface WeatherApiResponse {
  // Define the structure of the response data (you can expand it based on the OpenWeather API response)
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

export const handler = async (event: any): Promise<any> => {
  return {
    statusCode: 200,
    body: JSON.stringify("in history"),
  };
  // const city: string = event.pathParameters.city;
  // const apiKey: string = ""; //process.env.OPENWEATHER_API_KEY || "";
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
