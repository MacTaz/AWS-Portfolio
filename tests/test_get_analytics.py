import json
import os
from decimal import Decimal
from conftest import load_lambda_module


def test_rejects_missing_password(dynamodb_mock):
    os.environ["ADMIN_PASSWORD"] = "secret123"
    module = load_lambda_module(
        "getanalytics_module", "lambda-src/getAnalytics/lambda_function.py"
    )
    module.cached_password = "secret123"
    result = module.lambda_handler({"headers": {}}, None)

    assert result["statusCode"] == 401
    assert "Unauthorized" in result["body"]


def test_rejects_incorrect_password(dynamodb_mock):
    os.environ["ADMIN_PASSWORD"] = "secret123"
    module = load_lambda_module(
        "getanalytics_module", "lambda-src/getAnalytics/lambda_function.py"
    )
    module.cached_password = "secret123"
    result = module.lambda_handler({"headers": {"x-admin-password": "wrongpassword"}}, None)

    assert result["statusCode"] == 401
    assert "Unauthorized" in result["body"]


def test_returns_stored_summary_with_correct_password(dynamodb_mock):
    os.environ["ADMIN_PASSWORD"] = "secret123"
    analytics = dynamodb_mock.Table("SiteAnalytics")
    analytics.put_item(Item={
        "statId": "summary",
        "totalVisits": Decimal("42"),
        "anomalyDetected": False,
    })

    module = load_lambda_module(
        "getanalytics_module", "lambda-src/getAnalytics/lambda_function.py"
    )
    module.cached_password = "secret123"

    result = module.lambda_handler({"headers": {"x-admin-password": "secret123"}}, None)

    assert result["statusCode"] == 200
    assert result["headers"]["Access-Control-Allow-Origin"] == "*"

    body = json.loads(result["body"])
    assert body["totalVisits"] == 42
    assert body["anomalyDetected"] is False