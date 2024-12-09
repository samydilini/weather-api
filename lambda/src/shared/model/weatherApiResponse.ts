interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  coord: { lon: number; lat: number };
}
