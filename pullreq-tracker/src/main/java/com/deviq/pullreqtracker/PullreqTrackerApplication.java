package com.deviq.pullreqtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class PullreqTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PullreqTrackerApplication.class, args);
    }

}
