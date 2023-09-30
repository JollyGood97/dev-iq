package com.deviq.committracker.service;


import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.*;
import com.deviq.committracker.entity.CommitActivity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DynamoDBService {

    private final AmazonDynamoDB dynamoDB;

    public DynamoDBService(AmazonDynamoDB dynamoDB) {
        this.dynamoDB = dynamoDB;
    }

    public int getCommitCountByUser(String username) {
        QueryRequest queryRequest = new QueryRequest()
                .withTableName("CommitActivity")
                .withKeyConditionExpression("username = :username")
                .withExpressionAttributeValues(Collections.singletonMap(":username", new AttributeValue().withS(username)));

        QueryResult queryResult = dynamoDB.query(queryRequest);
        List<Map<String, AttributeValue>> items = queryResult.getItems();

        int totalCommitCount = 0;
        if (items != null) {
            for (Map<String, AttributeValue> item : items) {
                if (item.containsKey("commitCount")) {
                    totalCommitCount += Integer.parseInt(item.get("commitCount").getS());
                }
            }
        }
        return totalCommitCount;
    }

    public List<CommitActivity> getAllCommitActivities() {
        ScanRequest scanRequest = new ScanRequest()
                .withTableName("CommitActivity")
                .withLimit(10);

        ScanResult scanResult = dynamoDB.scan(scanRequest);
        List<Map<String, AttributeValue>> items = scanResult.getItems();

        List<CommitActivity> commitActivities = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            String username = item.get("username").getS();
            String commitCountStr = item.get("commitCount").getS();
            String date = item.get("date").getS();
            int commitCount = 0;
            if (commitCountStr != null) {
                commitCount = Integer.parseInt(commitCountStr);
            }
            commitActivities.add(new CommitActivity(username, commitCount, date));
        }

        return commitActivities;
    }
}
