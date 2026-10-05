package com.game.infinitequest.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineSpyPlayer {
    private String id;
    private String name;
    private boolean isHost;
    private boolean isAi;
    private String role; // "CIVILIAN", "UNDERCOVER", "MR_WHITE"
    private String secretWord;
    private String currentClue;

    @Builder.Default
    private List<String> clueHistory = new ArrayList<>();

    private String avatar;
    private boolean isEliminated;
    private String persona; // e.g. "Prabhas", "Allu Arjun", "Rajamouli", "Brahmanandam"

    @Builder.Default
    private int score = 0;

    @Builder.Default
    private int roundPointsEarned = 0;
}
