variable "project_name" { type = string }
variable "environment" { type = string }
variable "cloud_provider" { type = string }
variable "vpc_cidr" { type = string; default = "10.0.0.0/16" }

# AWS VPC
resource "aws_vpc" "main" {
  count      = var.cloud_provider == "aws" ? 1 : 0
  cidr_block = var.vpc_cidr
  tags       = { Name = "${var.project_name}-${var.environment}" }
}

resource "aws_subnet" "public" {
  count             = var.cloud_provider == "aws" ? 2 : 0
  vpc_id            = aws_vpc.main[0].id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available[0].names[count.index]
  tags              = { Name = "${var.project_name}-public-${count.index}" }
}

resource "aws_subnet" "private" {
  count             = var.cloud_provider == "aws" ? 2 : 0
  vpc_id            = aws_vpc.main[0].id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available[0].names[count.index]
  tags              = { Name = "${var.project_name}-private-${count.index}" }
}

data "aws_availability_zones" "available" {
  count = var.cloud_provider == "aws" ? 1 : 0
  state = "available"
}

# GCP VPC
resource "google_compute_network" "main" {
  count                   = var.cloud_provider == "gcp" ? 1 : 0
  name                    = "${var.project_name}-${var.environment}"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  count         = var.cloud_provider == "gcp" ? 1 : 0
  name          = "${var.project_name}-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.main[0].id
}

# Azure VNet
resource "azurerm_virtual_network" "main" {
  count               = var.cloud_provider == "azure" ? 1 : 0
  name                = "${var.project_name}-${var.environment}-vnet"
  address_space       = [var.vpc_cidr]
  location            = var.azure_location
  resource_group_name = var.azure_resource_group
}

variable "azure_location" { type = string; default = "westus2" }
variable "azure_resource_group" { type = string; default = "" }

output "vpc_id" {
  value = var.cloud_provider == "aws" ? try(aws_vpc.main[0].id, "") : ""
}
