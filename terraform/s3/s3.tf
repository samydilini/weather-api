data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "weather_data" {
  bucket = "weather-api-data-samuditha-${data.aws_caller_identity.current.account_id}"
}

output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.weather_data.bucket
}

resource "aws_s3_bucket_policy" "s3_log_policy" {
  bucket = aws_s3_bucket.weather_data.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAPIGatewayLogs",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.weather_data.bucket}/*",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "${data.aws_caller_identity.current.account_id}"
        }
      }
    }
  ]
}
POLICY
}

output "s3_log_arn" {
  description = "s3 buckets api logs arn"
  value       = aws_s3_bucket.weather_data.arn
}