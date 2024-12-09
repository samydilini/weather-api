# Include the provider configuration
provider "aws" {
  region = var.aws_region
}

# S3 Bucket for caching or storing weather data
module "s3" {
  source = "./s3"
}

# Lambda functions for handling weather API requests
module "lambda" {
  source = "./lambda"
  lambda_execution_role_arn = module.iam.lambda_execution_role_arn
  weather_api_execution_arn = module.apigateway.weather_api_execution_arn
  s3_bucket_name = module.s3.bucket_name
}

# API Gateway setup to expose Lambda functions as endpoints
module "apigateway" {
  source = "./apigateway"
  current_lambda_arn = module.lambda.current_lambda_arn
  history_lambda_arn = module.lambda.history_lambda_arn
}

# IAM roles for the Lambda functions
module "iam" {
  source = "./iam"
  s3_log_arn = module.s3.s3_log_arn
  aws_region = var.aws_region
}
