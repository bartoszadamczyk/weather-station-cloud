terraform {
  backend "remote" {
    organization = "bartoszadamczyk"

    workspaces {
      name = "weather-station"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

data "aws_region" "current" {}

locals {
  namespace = "ba"
  env = "prod"
  app_name = "weather-station"
  common_tags = map(
    "Project", local.app_name
  )
}

resource "aws_sqs_queue" "sqs_data_queue" {
  name = "${local.app_name}-${local.env}-data"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.sqs_data_dead_letter_queue.arn
    maxReceiveCount = 5
  })
  tags = local.common_tags
}

resource "aws_sqs_queue" "sqs_data_dead_letter_queue" {
  name = "${local.app_name}-${local.env}-data-dlq"
  tags = local.common_tags
}

resource "aws_iam_group" "iam_group_rpi" {
  name = "${local.app_name}-${local.env}-${data.aws_region.current.name}-rpi"
}

resource "aws_iam_group_policy" "iam_group_policy_rpi" {
  name = "sqs_data_queue_access_policy"
  group = aws_iam_group.iam_group_rpi.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sqs:SendMessage",
          "sqs:SendMessageBatch",
        ]
        Effect = "Allow"
        Resource = aws_sqs_queue.sqs_data_queue.arn
      },
    ]
  })
}

resource "aws_ssm_parameter" "ssm_data_sqs_arn" {
  name        = "${local.app_name}-${local.env}-data-sqs-arn"
  description = "Weather station data sqs arn"
  type        = "String"
  value       = aws_sqs_queue.sqs_data_queue.arn
  tags = local.common_tags
}
