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
    private String status;   // "LOBBY", "ROLE_REVEAL", "CLUE_ROUND", "VOTING", "WHITE_GUESS", "GAME_OVER"
    private String packCategory; // "MOVIES", "STARS", "SONGS", "CHARACTERS", "THEMES", "CUSTOM_AI"

    private String civilianWord;
    private String undercoverWord;

    @Builder.Default
    private Set<String> usedPairKeys = new HashSet<>();

    @Builder.Default
    private int matchesPlayedInRoom = 0;

    @Builder.Default
    private int undercoversCount = 1;
    @Builder.Default
    private int mrWhitesCount = 1;

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

    @Builder.Default
    private Map<String, String> votes = new HashMap<>(); // voterId -> suspectId

    private String whiteGuess;
    private Boolean whiteGuessSuccess;

    private String winner; // "CIVILIANS", "UNDERCOVER", "MR_WHITE"
    private String winReason;

    @Builder.Default
    private List<String> gameLogs = new ArrayList<>();

    @Builder.Default
    private List<EmojiReactionDto> recentReactions = new ArrayList<>();

    private long createdAt;
}
