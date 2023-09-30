package com.deviq.pullreqtracker.resource;

import com.deviq.pullreqtracker.entity.PullrequestActivity;
import com.deviq.pullreqtracker.service.DynamoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pullrequest")
public class PullRequestResource {

    @Autowired
    private DynamoDBService dynamoDBService;

    @GetMapping("/count/{username}")
    public int getTotalPullRequestsForUser(@PathVariable String username) {
        return dynamoDBService.getPullRequestCountByUser(username);
    }

    // For testing
    @GetMapping("/test")
    public String testEndpoint() {
        return "Hello, this is from pullreq tracker!";
    }

    @GetMapping("/list")
    public List<PullrequestActivity> getAllPullRequestActivities() {
        return dynamoDBService.getAllPullRequestActivities();
    }
}