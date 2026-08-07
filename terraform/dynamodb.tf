resource "aws_dynamodb_table" "visit_logs" {
  name         = "VisitLogs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "visitId"

  attribute {
    name = "visitId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "site_analytics" {
  name         = "SiteAnalytics"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "statId"

  attribute {
    name = "statId"
    type = "S"
  }
}
