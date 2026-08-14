import boto3
import uuid
from datetime import datetime, timezone

def lambda_handler(event, context):
    table = boto3.resource('dynamodb').Table('VisitLogs')

    headers = event.get('headers', {}) or {}
    referrer = headers.get('referer') or headers.get('Referer') or 'direct'

    table.put_item(Item={
        'visitId': str(uuid.uuid4()),
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'referrer': referrer
    })

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': 'Visit logged'
    }