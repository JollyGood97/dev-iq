package com.deviq.issuetracker.resource;

import com.deviq.issuetracker.entity.IssueActivity;
import com.deviq.issuetracker.service.DynamoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/issue")
public class IssueResource {

    @Autowired
    private DynamoDBService dynamoDBService;

    @GetMapping("/count/{username}")
    public int getTotalIssuesForUser(@PathVariable String username) {
        return dynamoDBService.getIssueCountByUser(username);
    }

    // For testing
    @GetMapping("/test")
    public String testEndpoint() {
        return "Hello, this is from issue tracker!";
    }

    @GetMapping("/list")
    public List<IssueActivity> getAllIssueActivities() {

        return dynamoDBService.getAllIssueActivities();
    }
}