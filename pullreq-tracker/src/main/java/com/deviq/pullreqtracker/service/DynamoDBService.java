package com.deviq.pullreqtracker.service;


import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.*;
import com.deviq.pullreqtracker.entity.PullrequestActivity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class DynamoDBService {

    private final AmazonDynamoDB dynamoDB;

    public DynamoDBService(AmazonDynamoDB dynamoDB) {
        this.dynamoDB = dynamoDB;
    }

    public int getPullRequestCountByUser(String username) {
        QueryRequest queryRequest = new QueryRequest()
                .withTableName("PullrequestActivity")
                .withKeyConditionExpression("username = :username")
                .withExpressionAttributeValues(Collections.singletonMap(":username", new AttributeValue().withS(username)));

        QueryResult queryResult = dynamoDB.query(queryRequest);
        List<Map<String, AttributeValue>> items = queryResult.getItems();

        int totalPullRequestCount = 0;
        if (items != null) {
            for (Map<String, AttributeValue> item : items) {
                if (item.containsKey("pullRequestCount")) {
                    totalPullRequestCount += Integer.parseInt(item.get("pullRequestCount").getS());
                }
            }
        }
        return totalPullRequestCount;
    }


    public List<PullrequestActivity> getAllPullRequestActivities() {
        ScanRequest scanRequest = new ScanRequest()
                .withTableName("PullrequestActivity")
                .withLimit(10);

        ScanResult scanResult = dynamoDB.scan(scanRequest);
        List<Map<String, AttributeValue>> items = scanResult.getItems();

        List<PullrequestActivity> pullRequestActivities = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            String username = item.get("username").getS();
            String pullRequestCountStr = item.get("pullRequestCount").getS();
            String date = item.get("date").getS();
            int pullRequestCount = 0;
            if (pullRequestCountStr != null) {
                pullRequestCount = Integer.parseInt(pullRequestCountStr);
            }
            pullRequestActivities.add(new PullrequestActivity(username, pullRequestCount, date));
        }

        return pullRequestActivities;
    }
}
