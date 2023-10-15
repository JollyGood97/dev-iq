package com.deviq.init.service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.*;
import org.springframework.stereotype.Service;

@Service
public class DynamoDBService {

    private final AmazonDynamoDB dynamoDB;

    public DynamoDBService(AmazonDynamoDB dynamoDB) {
        this.dynamoDB = dynamoDB;
    }

    public void storeCommitActivity(String username, int commitCount, String date) {
        PutItemRequest putItemRequest = new PutItemRequest()
                .withTableName("CommitActivity")
                .addItemEntry("username", new AttributeValue(username))
                .addItemEntry("commitCount", new AttributeValue(String.valueOf(commitCount)))
                .addItemEntry("date", new AttributeValue(date));
        dynamoDB.putItem(putItemRequest);
    }

    public void storePullRequestActivity(String username, int pullRequestCount, String date) {
        PutItemRequest putItemRequest = new PutItemRequest()
                .withTableName("PullrequestActivity")
                .addItemEntry("username", new AttributeValue(username))
                .addItemEntry("pullRequestCount", new AttributeValue(String.valueOf(pullRequestCount)))
                .addItemEntry("date", new AttributeValue(date));
        dynamoDB.putItem(putItemRequest);
    }

    public void storeIssueActivity(String username, int issueCount, String date) {
        PutItemRequest putItemRequest = new PutItemRequest()
                .withTableName("IssueActivity")
                .addItemEntry("username", new AttributeValue(username))
                .addItemEntry("issueCount", new AttributeValue(String.valueOf(issueCount)))
                .addItemEntry("date", new AttributeValue(date));
        dynamoDB.putItem(putItemRequest);
    }

}
