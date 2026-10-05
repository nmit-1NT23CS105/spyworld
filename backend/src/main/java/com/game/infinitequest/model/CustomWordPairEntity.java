package com.game.infinitequest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "custom_word_pairs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomWordPairEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category; // e.g. "CUSTOM_VS"

    @Column(nullable = false)
    private String wordA;

    @Column(nullable = false)
    private String wordB;

    private Long createdAt;
}
