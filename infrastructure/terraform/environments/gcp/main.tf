terraform {
  required_version = ">= 1.5"
  required_providers {
    google = { source = "hashicorp/google"; version = "~> 5.0" }
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

variable "gcp_project" { type = string }
variable "gcp_region" { default = "us-west1" }
variable "environment" { default = "production" }
variable "db_password" { sensitive = true }

module "networking" {
  source         = "../../modules/networking"
  project_name   = "erevive-nw"
  environment    = var.environment
  cloud_provider = "gcp"
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "postgres" {
  name             = "erevive-nw-${var.environment}"
  database_version = "POSTGRES_17"
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = false
      private_network = module.networking.vpc_id
    }
    backup_configuration { enabled = true }
  }
}

resource "google_sql_database" "erevive" {
  name     = "erevive"
  instance = google_sql_database_instance.postgres.name
}

# Cloud Storage for uploads
resource "google_storage_bucket" "uploads" {
  name          = "erevive-nw-uploads-${var.environment}"
  location      = var.gcp_region
  force_destroy = false

  encryption { default_kms_key_name = "" }
}

# Cloud Run services
resource "google_cloud_run_v2_service" "backend" {
  name     = "erevive-backend"
  location = var.gcp_region

  template {
    containers {
      image = "gcr.io/${var.gcp_project}/erevive-nw/backend:latest"
      ports { container_port = 8000 }
    }
  }
}

output "backend_url" { value = google_cloud_run_v2_service.backend.uri }
output "bucket" { value = google_storage_bucket.uploads.name }
