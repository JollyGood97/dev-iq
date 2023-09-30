package com.deviq.issuetracker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueActivity {
    @Id
    private String username;
    private int issueCount;
    private String date;
}
