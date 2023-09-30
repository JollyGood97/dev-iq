package com.deviq.committracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class CommitTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommitTrackerApplication.class, args);
    }

}
