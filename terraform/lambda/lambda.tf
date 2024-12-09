variable "lambda_execution_role_arn" {
  description = "ARN of the IAM role to be used by the Lambda function"
  type        = string
}

variable "weather_api_execution_arn" {
  description = "api gateway's execution arn"
  type        = string
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

resource "aws_lambda_function" "get_current_weather" {
  function_name = "getCurrentWeather"
  runtime       = "nodejs20.x"
  handler       = "getCurrentWeather.handler"
  role          = var.lambda_execution_role_arn
  filename      = "${path.module}/../../lambda/dist/getCurrentWeather.zip"

  environment {
      variables = {
        API_KEY = "/API_KEY"
        BUCKET_NAME = var.s3_bucket_name
      }
    }
}

resource "aws_lambda_function" "get_historical_weather" {
  function_name = "getHistoricalWeather"
  runtime       = "nodejs20.x"
  handler       = "getHistoricalWeather.handler"
  role          = var.lambda_execution_role_arn
  filename      = "${path.module}/../../lambda/dist/getHistoricalWeather.zip"
}

resource "aws_lambda_permission" "allow_apigateway_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_current_weather.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.weather_api_execution_arn}/*" 
}

resource "aws_lambda_permission" "allow_apigateway_invoke_history" {
  statement_id  = "AllowExecutionFromAPIGatewayHistory"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_historical_weather.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.weather_api_execution_arn}/*"
}

output "current_lambda_arn" {
  description = "arn of get_current_weather lambda"
  value       = aws_lambda_function.get_current_weather.arn
}

output "history_lambda_arn" {
  description = "arn of current get_historical_weather lambda"
  value       = aws_lambda_function.get_historical_weather.arn
}