# -----------------------------------------------------------------------------
# API Gateway (HTTP API) — portfolio-api
# Routes: POST /log-visit -> logVisit, GET /analytics -> getAnalytics
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "portfolio_api" {
  name          = "portfolio-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST"]
    allow_credentials = false
    max_age           = 0
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.portfolio_api.id
  name        = "$default"
  auto_deploy = true
}

# --- Integrations ---

resource "aws_apigatewayv2_integration" "log_visit" {
  api_id                 = aws_apigatewayv2_api.portfolio_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = "arn:aws:lambda:us-east-1:575108955018:function:logVisit"
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_integration" "get_analytics" {
  api_id                 = aws_apigatewayv2_api.portfolio_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = "arn:aws:lambda:us-east-1:575108955018:function:getAnalytics"
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

# --- Routes ---

resource "aws_apigatewayv2_route" "log_visit" {
  api_id    = aws_apigatewayv2_api.portfolio_api.id
  route_key = "POST /log-visit"
  target    = "integrations/${aws_apigatewayv2_integration.log_visit.id}"
}

resource "aws_apigatewayv2_route" "get_analytics" {
  api_id    = aws_apigatewayv2_api.portfolio_api.id
  route_key = "GET /analytics"
  target    = "integrations/${aws_apigatewayv2_integration.get_analytics.id}"
}

# --- Lambda permissions (allow API Gateway to invoke) ---

resource "aws_lambda_permission" "log_visit_apigw" {
  statement_id  = "e29b81ed-c831-5f58-a53f-621f569a6810"
  action        = "lambda:InvokeFunction"
  function_name = "logVisit"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:575108955018:${aws_apigatewayv2_api.portfolio_api.id}/*/*/log-visit"
}

resource "aws_lambda_permission" "get_analytics_apigw" {
  statement_id  = "59081e82-05c8-57d3-a1d0-21de3d8cf495"
  action        = "lambda:InvokeFunction"
  function_name = "getAnalytics"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:575108955018:${aws_apigatewayv2_api.portfolio_api.id}/*/*/analytics"
}
