output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = module.apigateway.api_gateway_url
}

output "s3_bucket_name" {
  description = "The bucket name to save data"
  value       =  module.s3.bucket_name
}

output "current_lambda_arn" {
  description = "arn of get_current_weather lambda"
  value       = module.lambda.current_lambda_arn
}

output "history_lambda_arn" {
  description = "arn of current get_historical_weather lambda"
  value       = module.lambda.history_lambda_arn
}
