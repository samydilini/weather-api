resource "aws_apigatewayv2_api" "weather_api" {
  name          = "WeatherAPI"
  protocol_type = "HTTP"
}

variable "current_lambda_arn" {
  description = "ARN of the current weather Lambda function"
  type        = string
}

variable "history_lambda_arn" {
  description = "ARN of the history weather Lambda function"
  type        = string
}

resource "aws_apigatewayv2_integration" "current_weather_integration" {
  api_id           = aws_apigatewayv2_api.weather_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.current_lambda_arn
}

resource "aws_apigatewayv2_route" "current_weather_route" {
  api_id    = aws_apigatewayv2_api.weather_api.id
  route_key = "GET /weather/{city}"
  target    = "integrations/${aws_apigatewayv2_integration.current_weather_integration.id}"
}

resource "aws_apigatewayv2_integration" "history_weather_integration" {
  api_id           = aws_apigatewayv2_api.weather_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.history_lambda_arn
}

resource "aws_apigatewayv2_route" "history_weather_route" {
  api_id    = aws_apigatewayv2_api.weather_api.id
  route_key = "GET /weather/history/{city}"
  target    = "integrations/${aws_apigatewayv2_integration.history_weather_integration.id}"
}


output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = aws_apigatewayv2_api.weather_api.api_endpoint
}