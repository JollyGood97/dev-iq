package com.deviq.init.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Slf4j
@Service
public class GitHubMetricsService {
    private static final Logger logger = LoggerFactory.getLogger(GitHubMetricsService.class);

    private final RestTemplate restTemplate;

    public GitHubMetricsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CircuitBreaker(name = "githubApi", fallbackMethod = "fallbackForFetchActivity")
    public String fetchCommitActivity(String owner, String repo, String username, String date) {
        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/commits?author=" + username + "&since=" + date;
        return restTemplate.getForObject(url, String.class);
    }

    @CircuitBreaker(name = "githubApi", fallbackMethod = "fallbackForFetchActivity")
    public String fetchPullRequestActivity(String owner, String repo, String username, String date) {
        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/pulls?author=" + username + "&since=" + date;
        return restTemplate.getForObject(url, String.class);
    }

    @CircuitBreaker(name = "githubApi", fallbackMethod = "fallbackForFetchActivity")
    public String fetchIssueActivity(String owner, String repo, String username, String date) {
        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/issues?author=" + username + "&since=" + date;
        return restTemplate.getForObject(url, String.class);
    }

    public String fallbackForFetchActivity(String owner, String repo, String username, String date, Throwable t) {
        logger.error("Error occurred while fetching activity for user: {}, repo: {}, owner: {}, date:{}. Error: {}", username, repo, owner, date, t.getMessage());
        return "{}";
    }


}
