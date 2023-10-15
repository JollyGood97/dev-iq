package com.deviq.init;

import com.deviq.init.service.DynamoDBService;
import com.deviq.init.service.GitHubMetricsService;
import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class GitHubDataInitializer implements CommandLineRunner {

    @Autowired
    private GitHubMetricsService gitHubMetricsService;

    @Autowired
    private DynamoDBService dynamoDBService;

    @Override
    public void run(String... args) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String today = sdf.format(new Date());
        fetchDataAndStore("CommitActivity", "fetchCommitActivity", "storeCommitActivity", today);
        fetchDataAndStore("PullrequestActivity", "fetchPullRequestActivity", "storePullRequestActivity", today);
        fetchDataAndStore("IssueActivity", "fetchIssueActivity", "storeIssueActivity", today);

    }
    private void fetchDataAndStore(String tableName, String fetchMethod, String storeMethod, String date) {
        try {
            // Fetch all users of repo
            String usersData = gitHubMetricsService.fetchUsers("apache", "superset");
            JSONArray usersArray = new JSONArray(usersData);

            // Uses only the first 3 users for convenience of demonstration purposes of assignment
            for (int i = 0; i < Math.min(3, usersArray.length()); i++) {
                JSONObject user = usersArray.getJSONObject(i);
                String username = user.getString("login");

                String data = (String) gitHubMetricsService.getClass().getMethod(fetchMethod, String.class, String.class, String.class, String.class)
                        .invoke(gitHubMetricsService, "apache", "superset", username, date);

                if (data != null && !data.isEmpty()) {
                    JSONArray jsonArray = new JSONArray(data);
                    int count = jsonArray.length();
                    dynamoDBService.getClass().getMethod(storeMethod, String.class, int.class, String.class)
                            .invoke(dynamoDBService, username, count, date);
                } else {
                    System.out.println("No data found for user: " + username);
                }
            }
        } catch (Exception e) {
            System.out.println("Error fetching data for table: " + tableName + ". Error: " + e.getMessage());
        }
    }


}