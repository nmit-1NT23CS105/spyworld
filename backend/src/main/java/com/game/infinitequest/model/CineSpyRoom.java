package com.game.infinitequest.model;

import com.game.infinitequest.model.dto.EmojiReactionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineSpyRoom {
    private String roomCode;
    private String gameMode; // "SOLO_AI", "LOCAL_PASS", "ONLINE_ROOM"
    private String status;   // "LOBBY", "ROLE_REVEAL", "CLUE_ROUND", "DISCUSSION", "VOTING", "VOTE_RESULT", "WHITE_GUESS", "GAME_OVER"
    private String packCategory; // "ALL_INDIAN_CINEMA", "MOVIES_TELUGU", "MOVIES_TAMIL", "MOVIES_HINDI", "MOVIES_MALAYALAM", "MOVIES_KANNADA", etc.

    @Builder.Default
    private String gameRuleMode = "CLASSIC"; // "CLASSIC", "MR_WHITE", "DOUBLE_UNDERCOVER", "RANDOM_SPY"
    @Builder.Default
    private String movieLanguage = "ALL_INDIAN"; // "ALL_INDIAN", "TELUGU", "TAMIL", "HINDI", "MALAYALAM", "KANNADA"
    @Builder.Default
    private String movieDifficulty = "EASY"; // "EASY", "MEDIUM", "HARD", "EXPERT"
    
    @Builder.Default
    private int clueTimerSeconds = 30;
    @Builder.Default
    private int discussionTimerSeconds = 60;
    @Builder.Default
    private int votingTimerSeconds = 30;

    private String civilianWord; // Majority Movie
    private String undercoverWord; // Undercover Movie

    @Builder.Default
    private Set<String> usedPairKeys = new HashSet<>();

    @Builder.Default
    private int matchesPlayedInRoom = 0;

    @Builder.Default
    private int undercoversCount = 1;
    @Builder.Default
    private int mrWhitesCount = 0;

    @Builder.Default
    private int roundNumber = 1;
    @Builder.Default
    private int currentSpeakerIndex = 0;

    @Builder.Default
    private List<String> speakingOrder = new ArrayList<>();

    @Builder.Default
    private List<CineSpyPlayer> players = new ArrayList<>();

    private String eliminatedPlayerId;
    private String eliminatedPlayerName;
    private String eliminatedPlayerRole;
    private String eliminationMessage;

    @Builder.Default
    private Map<String, String> votes = new HashMap<>(); // voterId -> suspectId

    @Builder.Default
    private Map<String, Integer> voteTally = new HashMap<>(); // suspectId -> vote count

    @Builder.Default
    private List<String> tiedCandidateIds = new ArrayList<>();

    @Builder.Default
    private boolean isRevote = false;

    private String whiteGuess;
    private Boolean whiteGuessSuccess;

    private String winner; // "NORMAL", "UNDERCOVER", "MR_WHITE"
    private String winReason;

    @Builder.Default
    private List<String> gameLogs = new ArrayList<>();

    @Builder.Default
    private List<EmojiReactionDto> recentReactions = new ArrayList<>();

    private long createdAt;
}
