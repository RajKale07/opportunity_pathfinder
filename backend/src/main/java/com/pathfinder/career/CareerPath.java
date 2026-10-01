package com.pathfinder.career;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career_paths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPath {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String title; // e.g. "Backend Developer", "Data Engineer", "ML Engineer", "Full Stack Developer"

    @Column(nullable = false, length = 100)
    private String domain; // e.g. "Software Engineering", "Artificial Intelligence", "Data Systems"

    @Column(length = 2048)
    private String description;

    @Column(length = 100)
    private String avgSalaryRange;

    @Column(length = 100)
    private String growthOutlook; // e.g. "High (+22% YoY)"

    @OneToMany(mappedBy = "careerPath", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CareerPathSkill> requiredSkills = new ArrayList<>();
}
