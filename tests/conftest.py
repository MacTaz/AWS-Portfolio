import os
import sys
import importlib.util
import pytest
from moto import mock_aws
import boto3

# Prevent boto3 from ever touching real AWS during tests
os.environ.setdefault("AWS_ACCESS_KEY_ID", "testing")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "testing")
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-1")


def load_lambda_module(module_name, file_path):
    """Load a lambda_function.py file under a unique module name, avoiding
    collisions since all three Lambdas share the same filename."""
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def dynamodb_mock():
    """Starts a fake AWS environment and creates both tables, matching
    the real schema: VisitLogs (PK: visitId) and SiteAnalytics (PK: statId)."""
    with mock_aws():
        client = boto3.client("dynamodb", region_name="us-east-1")

        client.create_table(
            TableName="VisitLogs",
            KeySchema=[{"AttributeName": "visitId", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "visitId", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )
        client.create_table(
            TableName="SiteAnalytics",
            KeySchema=[{"AttributeName": "statId", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "statId", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST",
        )

        yield boto3.resource("dynamodb", region_name="us-east-1")