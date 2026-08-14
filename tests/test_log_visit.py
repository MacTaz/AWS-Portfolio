from conftest import load_lambda_module


def test_logs_visit_with_referrer(dynamodb_mock):
    module = load_lambda_module(
        "logvisit_module", "lambda-src/logVisit/lambda_function.py"
    )

    event = {"headers": {"referer": "https://google.com"}}
    result = module.lambda_handler(event, None)

    assert result["statusCode"] == 200

    table = dynamodb_mock.Table("VisitLogs")
    items = table.scan()["Items"]
    assert len(items) == 1
    assert items[0]["referrer"] == "https://google.com"
    assert "timestamp" in items[0]
    assert "visitId" in items[0]


def test_defaults_to_direct_when_no_referrer(dynamodb_mock):
    module = load_lambda_module(
        "logvisit_module", "lambda-src/logVisit/lambda_function.py"
    )

    event = {"headers": {}}
    module.lambda_handler(event, None)

    table = dynamodb_mock.Table("VisitLogs")
    items = table.scan()["Items"]
    assert items[0]["referrer"] == "direct"