package com.deviq.init;

import com.deviq.init.service.DynamoDBService;
import com.deviq.init.service.GitHubMetricsService;
import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class GitHubDataInitializer {

    @Autowired
    private GitHubMetricsService gitHubMetricsService;

    @Autowired
    private DynamoDBService dynamoDBService;

    @PostConstruct
    public void initializeData() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String today = sdf.format(new Date());
        fetchDataAndStore("CommitActivity", "fetchCommitActivity", "storeCommitActivity", today);
        fetchDataAndStore("PullrequestActivity", "fetchPullRequestActivity", "storePullRequestActivity", today);
        fetchDataAndStore("IssueActivity", "fetchIssueActivity", "storeIssueActivity", today);
    }
    private void fetchDataAndStore(String tableName, String fetchMethod, String storeMethod, String date) {
        try {
            String data = (String) gitHubMetricsService.getClass().getMethod(fetchMethod, String.class, String.class, String.class, String.class)
                    .invoke(gitHubMetricsService, "apache", "superset", "mistercrunch", date);

            if (data != null && !data.isEmpty()) {
                JSONArray jsonArray = new JSONArray(data);
                int count = jsonArray.length();
                dynamoDBService.getClass().getMethod(storeMethod, String.class, int.class, String.class)
                        .invoke(dynamoDBService, "mistercrunch", count, date);
            } else {
                System.out.println("No data found for table: " + tableName);
            }
        } catch (Exception e) {
            System.out.println("Error fetching data for table: " + tableName + ". Error: " + e.getMessage());
        }
    }

}