from datetime import datetime, timezone
from conftest import load_lambda_module


def test_computes_summary_and_writes_dual_snapshot(dynamodb_mock):
    visit_logs = dynamodb_mock.Table("VisitLogs")
    visit_logs.put_item(Item={
        "visitId": "1", "timestamp": "2026-08-10T10:00:00+00:00", "referrer": "direct"
    })
    visit_logs.put_item(Item={
        "visitId": "2", "timestamp": "2026-08-10T11:00:00+00:00", "referrer": "https://google.com"
    })
    visit_logs.put_item(Item={
        "visitId": "3", "timestamp": "2026-08-11T09:00:00+00:00", "referrer": "direct"
    })

    module = load_lambda_module(
        "computeanalytics_module", "lambda-src/computeAnalytics/lambda_function.py"
    )
    module.lambda_handler({}, None)

    analytics = dynamodb_mock.Table("SiteAnalytics")

    # Live summary item still gets written, unchanged behavior
    summary = analytics.get_item(Key={"statId": "summary"})["Item"]
    assert summary["totalVisits"] == 3
    assert len(summary["visitsOverTime"]) == 2  # two distinct days

    # New: dated snapshot also gets written, matching the same data
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    snapshot = analytics.get_item(Key={"statId": f"summary#{today}"})["Item"]
    assert snapshot["totalVisits"] == summary["totalVisits"]
    assert snapshot["visitsOverTime"] == summary["visitsOverTime"]


def test_no_visits_produces_zero_totals(dynamodb_mock):
    module = load_lambda_module(
        "computeanalytics_module", "lambda-src/computeAnalytics/lambda_function.py"
    )
    module.lambda_handler({}, None)

    analytics = dynamodb_mock.Table("SiteAnalytics")
    summary = analytics.get_item(Key={"statId": "summary"})["Item"]
    assert summary["totalVisits"] == 0
    assert summary["anomalyDetected"] is False