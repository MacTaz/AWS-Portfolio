resource "aws_lambda_function" "logvisit" {
  function_name = "logVisit"
  role          = aws_iam_role.logvisit_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.13"
  timeout       = 3
  memory_size   = 128
  filename         = "lambda-code/logVisit.zip"
  source_code_hash = filebase64sha256("lambda-code/logVisit.zip")
}

resource "aws_lambda_function" "computeanalytics" {
  function_name = "computeAnalytics"
  role          = aws_iam_role.computeanalytics_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.13"
  timeout       = 3
  memory_size   = 128
  filename         = "lambda-code/computeAnalytics.zip"
  source_code_hash = filebase64sha256("lambda-code/computeAnalytics.zip")
}

resource "aws_lambda_function" "getanalytics" {
  function_name = "getAnalytics"
  role          = aws_iam_role.getanalytics_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.13"
  timeout       = 3
  memory_size   = 128
  filename         = "lambda-code/getAnalytics.zip"
  source_code_hash = filebase64sha256("lambda-code/getAnalytics.zip")
}