# -----------------------------------------------------------------------------
# AWS SSM Parameter Store — Portfolio Admin Password
# -----------------------------------------------------------------------------

resource "aws_ssm_parameter" "admin_password" {
  name        = "/portfolio/admin_password"
  description = "Admin password for portfolio analytics panel access"
  type        = "SecureString"
  value       = "demo1234"

  lifecycle {
    ignore_changes = [value]
  }
}
