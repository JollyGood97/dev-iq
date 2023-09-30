package com.deviq.committracker.resource;

import com.deviq.committracker.entity.CommitActivity;
import com.deviq.committracker.service.DynamoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/commit")
public class CommitResource {

    @Autowired
    private DynamoDBService dynamoDBService;

    @GetMapping("/count/{username}")
    public int getTotalCommitsForUser(@PathVariable String username) {
        return dynamoDBService.getCommitCountByUser(username);
    }
    // For testing
    @GetMapping("/test")
    public String testEndpoint() {
        return "Hello, this is from commit tracker!";
    }

    @GetMapping("/list")
    public List<CommitActivity> getAllCommitActivities() {

        return dynamoDBService.getAllCommitActivities();
    }
}