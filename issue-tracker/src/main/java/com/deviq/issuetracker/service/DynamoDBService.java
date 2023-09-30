package com.deviq.issuetracker.service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.*;
import com.deviq.issuetracker.entity.IssueActivity;
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

    public int getIssueCountByUser(String username) {
        QueryRequest queryRequest = new QueryRequest()
                .withTableName("IssueActivity")
                .withKeyConditionExpression("username = :username")
                .withExpressionAttributeValues(Collections.singletonMap(":username", new AttributeValue().withS(username)));

        QueryResult queryResult = dynamoDB.query(queryRequest);
        List<Map<String, AttributeValue>> items = queryResult.getItems();

        int totalIssueCount = 0;
        if (items != null) {
            for (Map<String, AttributeValue> item : items) {
                if (item.containsKey("issueCount")) {
                    totalIssueCount += Integer.parseInt(item.get("issueCount").getS());
                }
            }
        }
        return totalIssueCount;
    }


    public List<IssueActivity> getAllIssueActivities() {
        ScanRequest scanRequest = new ScanRequest()
                .withTableName("IssueActivity")
                .withLimit(10);

        ScanResult scanResult = dynamoDB.scan(scanRequest);
        List<Map<String, AttributeValue>> items = scanResult.getItems();

        List<IssueActivity> issueActivities = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            String username = item.get("username").getS();
            String issueCountStr = item.get("issueCount").getS();
            String date = item.get("date").getS();
            int issueCount = 0;
            if (issueCountStr != null) {
                issueCount = Integer.parseInt(issueCountStr);
            }
            issueActivities.add(new IssueActivity(username, issueCount, date));
        }

        return issueActivities;
    }
}
