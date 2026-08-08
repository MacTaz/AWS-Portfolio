# -----------------------------------------------------------------------------
# EventBridge — daily-analytics-trigger
# Fires computeAnalytics Lambda on a daily cron
# -----------------------------------------------------------------------------

resource "aws_cloudwatch_event_rule" "daily_analytics_trigger" {
  name                = "daily-analytics-trigger"
  description         = "Runs computeAnalytics once daily to refresh site stats"
  schedule_expression = "cron(0 16 * * ? *)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "compute_analytics_target" {
  rule      = aws_cloudwatch_event_rule.daily_analytics_trigger.name
  target_id = "hm2vi570r43phlu3ua"
  arn       = "arn:aws:lambda:us-east-1:575108955018:function:computeAnalytics"
}

resource "aws_lambda_permission" "compute_analytics_eventbridge" {
  statement_id  = "lambda-8d81cfa3-48d9-4b01-ac3a-56af557ea27c"
  action        = "lambda:InvokeFunction"
  function_name = "computeAnalytics"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_analytics_trigger.arn
}
