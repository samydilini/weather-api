resource "aws_s3_bucket" "weather_data" {
  bucket = "weather-api-data"
}

output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.weather_data.bucket
}