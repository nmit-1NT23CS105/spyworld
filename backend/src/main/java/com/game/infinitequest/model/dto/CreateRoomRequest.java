package com.game.infinitequest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomRequest {
    private String hostName;
    private String gameMode; // "SOLO_AI", "LOCAL_PASS", "ONLINE_ROOM"
    private String packCategory; // "ALL_INDIAN_CINEMA", "MOVIES_TELUGU", "MOVIES_TAMIL", etc.
    private Integer totalPlayers; // 4 to 20
    private Integer undercoversCount;
    private Integer mrWhitesCount;
    private List<String> localPlayerNames; // For LOCAL_PASS mode
    private String gameRuleMode; // "CLASSIC", "MR_WHITE", "DOUBLE_UNDERCOVER", "RANDOM_SPY"
    private String movieLanguage; // "ALL_INDIAN", "TELUGU", "TAMIL", "HINDI", "MALAYALAM", "KANNADA"
    private String movieDifficulty; // "EASY", "MEDIUM", "HARD", "EXPERT"
    private Integer clueTimerSeconds;
    private Integer discussionTimerSeconds;
    private Integer votingTimerSeconds;
}
