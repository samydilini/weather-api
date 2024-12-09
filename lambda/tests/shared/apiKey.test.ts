import * as AWS from "aws-sdk";
import apiKey from "../../src/shared/apiKey";

// Mock AWS SSM
jest.mock("aws-sdk", () => {
  const mockSSM = {
    getParameter: jest.fn(),
  };
  return {
    SSM: jest.fn(() => mockSSM),
  };
});

describe("apiKey.getApiKey", () => {
  let ssmMock: jest.Mocked<AWS.SSM>;

  beforeEach(() => {
    ssmMock = new AWS.SSM() as jest.Mocked<AWS.SSM>;
    jest.clearAllMocks();
  });

  it("throws an error if API_KEY environment variable is not set", async () => {
    delete process.env.API_KEY;
    await expect(apiKey.getApiKey()).rejects.toThrow(
      "Environment variable API_KEY is required but not set."
    );
  });

  it("throws an error if SSM parameter is missing or has no value", async () => {
    process.env.API_KEY = "test-parameter-name";

    ssmMock.getParameter.mockImplementationOnce(
      () =>
        ({
          promise: jest.fn().mockResolvedValue({}),
        } as any)
    );

    await expect(apiKey.getApiKey()).rejects.toThrow(
      "SSM parameter 'test-parameter-name' is missing or has no value."
    );
  });

  it("returns the parameter value if it exists", async () => {
    process.env.API_KEY = "test-parameter-name";
    ssmMock.getParameter.mockImplementationOnce(
      () =>
        ({
          promise: jest.fn().mockResolvedValue({
            Parameter: { Value: "mock-api-key" },
          }),
        } as any)
    );
    const result = await apiKey.getApiKey();
    expect(result).toBe("mock-api-key");
    expect(ssmMock.getParameter).toHaveBeenCalledWith({
      Name: "test-parameter-name",
    });
  });
});
