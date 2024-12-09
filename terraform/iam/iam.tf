resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

output "lambda_execution_role_arn" {
  description = "ARN of get_current_weather lambda"
  value       = aws_iam_role.lambda_execution_role.arn
}

variable "s3_log_arn" {
  description = "s3 arn value"
  type        = string
}


# Create a policy that allows Lambda to put objects in S3
resource "aws_iam_policy" "lambda_s3_put_object_policy" {
  name        = "LambdaS3PutObjectPolicy"
  description = "Allow Lambda functions to write to the S3 bucket"
  policy      = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "${var.s3_log_arn}/*"
    }
  ]
}
POLICY
}

# Attach the policy to the Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_s3_put_object_policy.arn
}

variable "aws_region" {
  description = "aws region"
  type        = string
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "lambda_ssm_access_policy" {
  name = "lambda-ssm-access"
#   role = aws_iam_role.lambda_execution_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/API_KEY"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_ssm_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_ssm_access_policy.arn
}