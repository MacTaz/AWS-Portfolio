# -----------------------------------------------------------------------------
# CloudFront — portfolio distribution (EQ1GGDBHFQ40L)
# Serves mico-portfolio S3 bucket via Origin Access Control (OAC)
# -----------------------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "portfolio_oac" {
  name                              = "oac-mico-portfolio.s3.us-east-1.amazonaws.com-msfvsitae2j"
  description                       = "Created by CloudFront"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "portfolio" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  http_version        = "http2"
  is_ipv6_enabled     = true
  comment             = ""
  tags = {
    Name = "mico-portfolio"
  }
  aliases = ["micotazarte.dev", "www.micotazarte.dev"]

  origin {
    domain_name              = "mico-portfolio.s3.us-east-1.amazonaws.com"
    origin_id                = "mico-portfolio.s3.us-east-1.amazonaws.com-msfvpk5yuw1"
    origin_access_control_id = aws_cloudfront_origin_access_control.portfolio_oac.id

    connection_attempts = 3
    connection_timeout  = 10

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  default_cache_behavior {
    target_origin_id       = "mico-portfolio.s3.us-east-1.amazonaws.com-msfvpk5yuw1"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:575108955018:certificate/bc55f6bd-7bf4-4772-84f4-68851905589d"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
