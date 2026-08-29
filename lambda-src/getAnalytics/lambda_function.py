import boto3
import json
import hmac
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
ssm = boto3.client('ssm')

analytics_table = dynamodb.Table('SiteAnalytics')
cached_password = None

def get_ssm_password():
    global cached_password
    if cached_password is not None:
        return cached_password
    
    try:
        response = ssm.get_parameter(
            Name='/portfolio/admin_password',
            WithDecryption=True
        )
        cached_password = response['Parameter']['Value']
    except Exception as e:
        print(f"Error fetching SSM parameter: {e}")
        cached_password = os.environ.get('ADMIN_PASSWORD', 'demo1234')
    
    return cached_password

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    headers = (event or {}).get('headers', {}) or {}
    
    # Case-insensitive header lookup for x-admin-password
    provided_password = None
    for k, v in headers.items():
        if k.lower() == 'x-admin-password':
            provided_password = v
            break

    expected_password = get_ssm_password()
    
    # Constant-time comparison to prevent timing side-channel attacks
    authorized = False
    if provided_password is not None and expected_password is not None:
        authorized = hmac.compare_digest(
            provided_password.encode('utf-8'),
            expected_password.encode('utf-8')
        )
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-admin-password,X-Admin-Password',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    }

    if not authorized:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Unauthorized: Incorrect or missing admin password'})
        }

    response = analytics_table.get_item(Key={'statId': 'summary'})
    item = response.get('Item', {})
    
    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps(item, default=decimal_default)
    }