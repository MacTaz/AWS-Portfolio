import json
from decimal import Decimal
from conftest import load_lambda_module


def test_returns_stored_summary(dynamodb_mock):
    analytics = dynamodb_mock.Table("SiteAnalytics")
    analytics.put_item(Item={
        "statId": "summary",
        "totalVisits": Decimal("42"),
        "anomalyDetected": False,
    })

    module = load_lambda_module(
        "getanalytics_module", "lambda-src/getAnalytics/lambda_function.py"
    )
    result = module.lambda_handler({}, None)

    assert result["statusCode"] == 200
    assert result["headers"]["Access-Control-Allow-Origin"] == "*"

    body = json.loads(result["body"])
    assert body["totalVisits"] == 42
    assert body["anomalyDetected"] is False


def test_returns_empty_when_no_summary_exists(dynamodb_mock):
    module = load_lambda_module(
        "getanalytics_module", "lambda-src/getAnalytics/lambda_function.py"
    )
    result = module.lambda_handler({}, None)

    assert result["statusCode"] == 200
    assert json.loads(result["body"]) == {}