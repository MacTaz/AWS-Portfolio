import boto3
import json
from datetime import datetime, timezone
from collections import Counter
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
visit_logs_table = dynamodb.Table('VisitLogs')
analytics_table = dynamodb.Table('SiteAnalytics')

def lambda_handler(event, context):
    response = visit_logs_table.scan()
    items = response['Items']
    
    while 'LastEvaluatedKey' in response:
        response = visit_logs_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items.extend(response['Items'])
    
    total_visits = len(items)
    
    # Visits per day
    daily_counts = Counter()
    for item in items:
        ts = item.get('timestamp', '')
        if ts:
            day = ts[:10]  # 'YYYY-MM-DD' from ISO timestamp
            daily_counts[day] += 1
    
    # Sort daily counts chronologically
    visits_over_time = [
        {'date': day, 'count': count}
        for day, count in sorted(daily_counts.items())
    ]
    
    # Top referrers
    referrer_counts = Counter(item.get('referrer', 'direct') for item in items)
    top_referrers = [
        {'referrer': ref, 'count': count}
        for ref, count in referrer_counts.most_common(10)
    ]
    
    # Basic anomaly detection: z-score on today's count vs rolling average
    counts_list = [d['count'] for d in visits_over_time]
    anomaly_flag = False
    if len(counts_list) >= 3:
        avg = sum(counts_list[:-1]) / len(counts_list[:-1])
        variance = sum((x - avg) ** 2 for x in counts_list[:-1]) / len(counts_list[:-1])
        std_dev = variance ** 0.5
        if std_dev > 0:
            z_score = (counts_list[-1] - avg) / std_dev
            anomaly_flag = abs(z_score) > 2  # flag if today is 2+ std devs from average
    
    summary = {
        'statId': 'summary',
        'totalVisits': total_visits,
        'visitsOverTime': visits_over_time,
        'topReferrers': top_referrers,
        'anomalyDetected': anomaly_flag,
        'lastUpdated': datetime.now(timezone.utc).isoformat()
    }
    
    # DynamoDB needs Decimal, not float, for numeric types
    summary_json = json.loads(json.dumps(summary), parse_float=Decimal)
    
    analytics_table.put_item(Item=summary_json)

    analytics_table.put_item(Item=summary_json)

    # Dual-write: also store a dated snapshot for historical trend data
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    snapshot = dict(summary_json)
    snapshot['statId'] = f'summary#{today}'
    analytics_table.put_item(Item=snapshot)

    return {
        'statusCode': 200,
        'body': json.dumps(summary)
    }
    
    return {
        'statusCode': 200,
        'body': json.dumps(summary)
    }