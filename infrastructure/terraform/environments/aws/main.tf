terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = { source = "hashicorp/aws"; version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" { default = "us-west-2" }
variable "environment" { default = "production" }
variable "db_password" { sensitive = true }

module "networking" {
  source         = "../../modules/networking"
  project_name   = "erevive-nw"
  environment    = var.environment
  cloud_provider = "aws"
}

# ECR Repository
resource "aws_ecr_repository" "backend" {
  name                 = "erevive-nw/backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "frontend" {
  name                 = "erevive-nw/frontend"
  image_tag_mutability = "MUTABLE"
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "erevive-nw-${var.environment}"
  engine               = "postgres"
  engine_version       = "17"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "erevive"
  username             = "erevive_app"
  password             = var.db_password
  skip_final_snapshot  = true
  storage_encrypted    = true
  publicly_accessible  = false

  tags = { Name = "erevive-nw-${var.environment}" }
}

# S3 for image uploads
resource "aws_s3_bucket" "uploads" {
  bucket = "erevive-nw-uploads-${var.environment}"
  tags   = { Name = "erevive-nw-uploads" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } }
}

output "db_endpoint" { value = aws_db_instance.postgres.endpoint }
output "s3_bucket" { value = aws_s3_bucket.uploads.id }
