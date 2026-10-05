package com.game.infinitequest.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "player_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerProfileEntity {

    @Id
    @Column(nullable = false, unique = true)
    private String playerName;

    @Builder.Default
    private int totalScore = 0;

    @Builder.Default
    private int gamesPlayed = 0;

    @Builder.Default
    private int wins = 0;

    private String favoriteAvatar;
    private Long lastPlayedAt;
}
