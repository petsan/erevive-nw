terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = { source = "hashicorp/azurerm"; version = "~> 3.0" }
  }
}

provider "azurerm" { features {} }

variable "environment" { default = "production" }
variable "location" { default = "westus2" }
variable "db_password" { sensitive = true }

resource "azurerm_resource_group" "main" {
  name     = "erevive-nw-${var.environment}"
  location = var.location
}

module "networking" {
  source               = "../../modules/networking"
  project_name         = "erevive-nw"
  environment          = var.environment
  cloud_provider       = "azure"
  azure_location       = var.location
  azure_resource_group = azurerm_resource_group.main.name
}

# Azure Database for PostgreSQL
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                = "erevive-nw-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  sku_name            = "B_Standard_B1ms"
  version             = "17"
  storage_mb          = 32768

  administrator_login    = "erevive_app"
  administrator_password = var.db_password
}

resource "azurerm_postgresql_flexible_server_database" "erevive" {
  name      = "erevive"
  server_id = azurerm_postgresql_flexible_server.postgres.id
}

# Blob Storage for uploads
resource "azurerm_storage_account" "uploads" {
  name                     = "erevivenw${var.environment}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
}

resource "azurerm_storage_container" "uploads" {
  name                  = "uploads"
  storage_account_id    = azurerm_storage_account.uploads.id
  container_access_type = "private"
}

output "db_fqdn" { value = azurerm_postgresql_flexible_server.postgres.fqdn }
output "storage_account" { value = azurerm_storage_account.uploads.name }
