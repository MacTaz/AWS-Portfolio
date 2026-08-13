# ============================
# Lambda Execution Roles
# ============================

resource "aws_iam_role" "logvisit_role" {
  name = "logVisit-role-mvvrhkvd"
  path = "/service-role/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "logvisit_dynamodb_write" {
  name = "lambda-dynamodb-write"
  role = aws_iam_role.logvisit_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem"]
        Resource = "arn:aws:dynamodb:us-east-1:*:table/VisitLogs"
      }
    ]
  })
}

resource "aws_iam_role" "computeanalytics_role" {
  name = "computeAnalytics-role-nikjp3f9"
  path = "/service-role/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "computeanalytics_access" {
  name = "compute-analytics-access"
  role = aws_iam_role.computeanalytics_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:Scan"]
        Resource = "arn:aws:dynamodb:us-east-1:575108955018:table/VisitLogs"
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem"]
        Resource = "arn:aws:dynamodb:us-east-1:575108955018:table/SiteAnalytics"
      }
    ]
  })
}

resource "aws_iam_role" "getanalytics_role" {
  name = "getAnalytics-role-j24fn5x0"
  path = "/service-role/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "getanalytics_dynamodb_allow" {
  name = "getAnalytics-dynamodb-allow"
  role = aws_iam_role.getanalytics_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem"]
        Resource = "arn:aws:dynamodb:us-east-1:575108955018:table/SiteAnalytics"
      }
    ]
  })
}

# ============================
# IAM Users' Managed Policies
# ============================

resource "aws_iam_policy" "github_actions_deploy_policy" {
  name = "github-actions-deploy-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::mico-portfolio",
          "arn:aws:s3:::mico-portfolio/*"
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:CreateInvalidation"]
        Resource = "arn:aws:cloudfront::575108955018:distribution/EQ1GGDBHFQ40L"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "github_actions_deploy_attach" {
  user       = "github-actions-deploy"
  policy_arn = aws_iam_policy.github_actions_deploy_policy.arn
}


resource "aws_iam_policy" "mico_personal_cli_policy" {
  name = "mico-personal-cli-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:*",
          "cloudfront:*",
          "dynamodb:*",
          "lambda:*",
          "apigateway:*",
          "events:*",
          "logs:*",
          "iam:Get*",
          "iam:List*",
          "iam:PassRole",
          "iam:CreatePolicyVersion",
          "iam:DeletePolicyVersion",
          "iam:SetDefaultPolicyVersion",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "mico_personal_cli_attach" {
  user       = "mico-personal-cli"
  policy_arn = aws_iam_policy.mico_personal_cli_policy.arn
}
