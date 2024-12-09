import axios from "axios";
import { handler } from "../src/getHistoricalWeather";
import ApiKey from "../src/shared/apiKey";
import Logger from "../src/shared/logger";
import S3Logger from "../src/shared/s3Logger";

jest.mock("axios");
jest.mock("../src/shared/logger", () => ({
  info: jest.fn(),
}));
jest.mock("../src/shared/s3Logger", () => ({
  printRequest: jest.fn(),
  printResponse: jest.fn(),
}));
jest.mock("../src/shared/apiKey", () => ({
  getApiKey: jest.fn(),
}));

describe("Weather History Lambda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should return weather data successfully", async () => {
    const city = "London";
    const event = {
      pathParameters: {
        city: city,
      },
    };
    const mockApiKey = "mock_api_key";
    const mockedGetApiKey = jest.mocked(ApiKey.getApiKey);
    mockedGetApiKey.mockResolvedValue(mockApiKey);
    const mockDate = new Date(2024, 11, 9); // December 9, 2024
    jest.useFakeTimers().setSystemTime(mockDate);
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=mock_api_key`;
    const mockResponse = {
      current: { temp: 283.5, humidity: 72 },
      hourly: [{ temp: 282.7, humidity: 75 }],
    };

    const threeDaysAgo = Math.floor(
      new Date(new Date().setDate(new Date().getDate() - 3)).getTime() / 1000
    );

    // Mock the axios.get call to return the mock response
    jest.mocked(axios.get).mockResolvedValue({ data: mockResponse });

    const coordinates = { lat: 40.7128, lon: -74.006 };
    const historyUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${coordinates.lat}&lon=${coordinates.lon}&dt=${threeDaysAgo}&appid=mock_api_key`;

    // Mock the API call to the above URL
    jest.mocked(axios.get).mockImplementation((url: string) => {
      if (url === historyUrl) {
        return Promise.resolve({ data: mockResponse });
      } else if (url === currentUrl) {
        return Promise.resolve({
          data: {
            main: { temp: 15 },
            weather: [{ description: "clear sky" }],
            coord: { lat: 40.7128, lon: -74.006 },
          },
        });
      }
      return Promise.reject(new Error("Not Found"));
    });

    // Call the lambda function with the test event
    const response = await handler(event);

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockResponse));
  });

  it("should handle errors gracefully", async () => {
    const city = "London";
    const event = {
      pathParameters: {
        city: city,
      },
    };

    jest.mocked(axios.get).mockImplementation((url: string) => {
      return Promise.reject(new Error("error"));
    });
    // Call the handler function
    const response = await handler(event);

    // Validate the status code and error response
    expect(response.statusCode).toBe(500);
    expect(response.body).toContain("error");

    // Check the mock function calls
    expect(Logger.info).toHaveBeenCalled();
    expect(S3Logger.printRequest).toHaveBeenCalled();
  });
});
