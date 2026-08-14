import boto3
import json
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
analytics_table = dynamodb.Table('SiteAnalytics')

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    response = analytics_table.get_item(Key={'statId': 'summary'})
    item = response.get('Item', {})
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(item, default=decimal_default)
    }