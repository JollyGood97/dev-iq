package com.deviq.init.resource;

import com.deviq.init.service.DynamoDBService;
import com.deviq.init.service.GitHubMetricsService;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/init")
public class InitResource {

    @Autowired
    private GitHubMetricsService gitHubMetricsService;

    @Autowired
    private DynamoDBService dynamoDBService;

    @PostMapping("/commits")
    public String initializeData(@RequestBody InitRequest initRequest) {
        String date = initRequest.getDate() != null ? initRequest.getDate() : getTodayDate();
        String commitData = gitHubMetricsService.fetchCommitActivity(initRequest.getOwner(), initRequest.getRepo(), initRequest.getUsername(), date);
        JSONArray jsonArray = new JSONArray(commitData);
        int commitCount = jsonArray.length();
        dynamoDBService.storeCommitActivity(initRequest.getUsername(), commitCount, date);
        return "Commit data written successfully.";
    }

    @PostMapping("/pulls")
    public String initializePullRequests(@RequestBody InitRequest initRequest) {
        String date = initRequest.getDate() != null ? initRequest.getDate() : getTodayDate();
        String pullRequestData = gitHubMetricsService.fetchPullRequestActivity(initRequest.getOwner(), initRequest.getRepo(), initRequest.getUsername(), date);
        JSONArray jsonArray = new JSONArray(pullRequestData);
        int pullRequestCount = jsonArray.length();
        dynamoDBService.storePullRequestActivity(initRequest.getUsername(), pullRequestCount, date);
        return "Pull request data written successfully.";
    }

    @PostMapping("/issues")
    public String initializeIssues(@RequestBody InitRequest initRequest) {
        String date = initRequest.getDate() != null ? initRequest.getDate() : getTodayDate();
        String issueData = gitHubMetricsService.fetchIssueActivity(initRequest.getOwner(), initRequest.getRepo(), initRequest.getUsername(), date);
        JSONArray jsonArray = new JSONArray(issueData);
        int issueCount = jsonArray.length();
        dynamoDBService.storeIssueActivity(initRequest.getUsername(), issueCount, date);
        return "Issue data written successfully.";
    }

    private String getTodayDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }

    // For testing
    @GetMapping("/test")
    public String testEndpoint() {
        return "Hello, this is a test!";
    }

    public static class InitRequest {
        private String owner;
        private String repo;
        private String username;
        private String date;

        public String getOwner() {
            return owner;
        }

        public void setOwner(String owner) {
            this.owner = owner;
        }

        public String getRepo() {
            return repo;
        }

        public void setRepo(String repo) {
            this.repo = repo;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }


        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }
}