process.env.BUCKET_NAME = "test-bucket";
import { s3Logger } from "../../src/shared/s3Logger"; // adjust the path based on your file structure
import * as AWS from "aws-sdk";

// Mock the AWS S3 class and the putObject method
jest.mock("aws-sdk", () => {
  const mS3 = {
    putObject: jest
      .fn()
      .mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
  };
  return { S3: jest.fn(() => mS3) };
});

describe("s3Logger", () => {
  let s3Instance: AWS.S3;

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    s3Instance = new AWS.S3();
  });

  it("should upload request log to S3 successfully", async () => {
    const message = "Request message";

    // Call the printRequest method
    await s3Logger.printRequest(message);

    // Check if putObject was called with the expected parameters
    expect(s3Instance.putObject).toHaveBeenCalledWith({
      Bucket: process.env.BUCKET_NAME,
      Key: expect.stringMatching(/logs\/\d+_request\.log/), // Expect a timestamp in the filename
      Body: message,
      ContentType: "application/json",
    });

    // Check that putObject was called once
    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
  });

  it("should upload response log to S3 successfully", async () => {
    const message = "Response message";

    // Call the printResponse method
    await s3Logger.printResponse(message);

    // Check if putObject was called with the expected parameters
    expect(s3Instance.putObject).toHaveBeenCalledWith({
      Bucket: process.env.BUCKET_NAME,
      Key: expect.stringMatching(/logs\/\d+_response\.log/), // Expect a timestamp in the filename
      Body: message,
      ContentType: "application/json",
    });

    // Check that putObject was called once
    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if BUCKET_NAME is not set", async () => {
    // Temporarily remove the BUCKET_NAME environment variable
    delete process.env.BUCKET_NAME;

    const message = "Message without BUCKET_NAME";

    // Expect the print method to throw an error
    await expect(s3Logger.print(message, "logs/test.log")).rejects.toThrow(
      "Environment variable BUCKET_NAME is required but not set."
    );
  });

  // it("should handle errors gracefully in printRequest method", async () => {
  //   const message = "Request message";

  //   // Force the mock to simulate an error
  //   // jest.mocked(s3Instance.putObject).mockReturnValueOnce({
  //   //   promise: jest.fn().mockRejectedValue(new Error("S3 Error")),
  //   // });
  //   jest.mocked(s3Instance.putObject).mockImplementation(() => {
  //     throw new Error("S3 Error");
  //   });
  //   // Call the printRequest method
  //   await s3Logger.printRequest(message);

  //   // Check that the error was logged
  //   expect(console.error).toHaveBeenCalledWith(
  //     "Failed to upload the request to S3",
  //     expect.any(Error)
  //   );
  // });

  // it("should handle errors gracefully in printResponse method", async () => {
  //   const message = "Response message";

  //   // Force the mock to simulate an error
  //   s3Instance.putObject.mockReturnValueOnce({
  //     promise: jest.fn().mockRejectedValue(new Error("S3 Error")),
  //   });

  //   // Call the printResponse method
  //   await s3Logger.printResponse(message);

  //   // Check that the error was logged
  //   expect(console.error).toHaveBeenCalledWith(
  //     "Failed to upload the response to S3",
  //     expect.any(Error)
  //   );
  // });
});
