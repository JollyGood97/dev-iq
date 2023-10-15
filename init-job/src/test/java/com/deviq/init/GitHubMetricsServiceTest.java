package com.deviq.init;

import com.deviq.init.service.GitHubMetricsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
public class GitHubMetricsServiceTest {

    @Autowired
    private GitHubMetricsService gitHubMetricsService;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    public void testCircuitBreakerFallback() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenThrow(new RestClientException("Simulated API failure"));

        String result = gitHubMetricsService.fetchCommitActivity("owner", "repo", "username", "2023-09-01");

        assertEquals("{}", result);
    }
}
