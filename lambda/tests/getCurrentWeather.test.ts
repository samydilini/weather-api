import { handler } from "../src/getCurrentWeather";
import axios from "axios";
import Logger from "../src/shared/logger";
import S3Logger from "../src/shared/s3Logger";
import ApiKey from "../src/shared/apiKey";

// Mock the external dependencies
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

describe("Lambda handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should return weather data when the API request is successful", async () => {
    const city = "London";
    const event = {
      pathParameters: {
        city: city,
      },
    };

    const mockApiKey = "mockApiKey";
    const mockWeatherResponse = {
      data: {
        main: { temp: 15 },
        weather: [{ description: "clear sky" }],
      },
    };

    // Mock the external function calls
    const mockedGetApiKey = jest.mocked(ApiKey.getApiKey);
    mockedGetApiKey.mockResolvedValue(mockApiKey);
    jest.mocked(axios.get).mockResolvedValue(mockWeatherResponse);

    const result = await handler(event);

    expect(ApiKey.getApiKey).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mockApiKey}`
    );
    expect(Logger.info).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );
    expect(S3Logger.printRequest).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );
    expect(Logger.info).toHaveBeenCalledWith(
      `Current weather response for ${city}`
    );
    expect(S3Logger.printResponse).toHaveBeenCalledWith(
      `Current weather response for ${city}`
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(mockWeatherResponse.data));
  });

  it("should return error response when there is an error fetching weather data", async () => {
    const city = "London";
    const event = {
      pathParameters: {
        city: city,
      },
    };

    const mockApiKey = "mockApiKey";
    const mockError = new Error("API request failed");

    // Mock the external function calls
    const mockedGetApiKey = jest.mocked(ApiKey.getApiKey);
    mockedGetApiKey.mockResolvedValue(mockApiKey);
    jest.mocked(axios.get).mockRejectedValue(mockError);

    const result = await handler(event);

    expect(ApiKey.getApiKey).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mockApiKey}`
    );
    expect(Logger.info).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );
    expect(S3Logger.printRequest).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "API request failed" }));
  });

  it("should return error response when API key retrieval fails", async () => {
    const city = "London";
    const event = {
      pathParameters: {
        city: city,
      },
    };

    const mockError = new Error("API key retrieval failed");

    jest.mocked(ApiKey.getApiKey).mockImplementation(() => {
      throw mockError;
    });

    const result = await handler(event);

    expect(ApiKey.getApiKey).toHaveBeenCalledTimes(1);
    expect(axios.get).not.toHaveBeenCalled();
    expect(Logger.info).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );
    expect(S3Logger.printRequest).toHaveBeenCalledWith(
      `Current weather request for ${city}`
    );

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ error: "API key retrieval failed" })
    );
  });
});
