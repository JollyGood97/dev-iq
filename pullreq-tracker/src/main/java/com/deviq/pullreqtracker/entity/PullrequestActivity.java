package com.deviq.pullreqtracker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PullrequestActivity {
    @Id
    private String username;
    private int pullRequestCount;
    private String date;
}
