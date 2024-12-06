variable "lambda_execution_role_arn" {
  description = "ARN of the IAM role to be used by the Lambda function"
  type        = string
}

resource "aws_lambda_function" "get_current_weather" {
  function_name = "getCurrentWeather"
  runtime       = "nodejs20.x"
  handler       = "getCurrentWeather.handler"
  role          = var.lambda_execution_role_arn
  filename      = "getCurrentWeather.zip"
}

resource "aws_lambda_function" "get_historical_weather" {
  function_name = "getHistoricalWeather"
  runtime       = "nodejs20.x"
  handler       = "getHistoricalWeather.handler"
  role          = var.lambda_execution_role_arn
  filename      = "getHistoricalWeather.zip"

  
}


output "current_lambda_arn" {
  description = "arn of get_current_weather lambda"
  value       = aws_lambda_function.get_current_weather.arn
}

output "history_lambda_arn" {
  description = "arn of current get_historical_weather lambda"
  value       = aws_lambda_function.get_historical_weather.arn
}