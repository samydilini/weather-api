interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}
