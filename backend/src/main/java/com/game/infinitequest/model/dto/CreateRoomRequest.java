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
    private String packCategory; // "MOVIES", "STARS", "SONGS", "CHARACTERS", "THEMES"
    private Integer totalPlayers; // e.g. 5
    private Integer undercoversCount;
    private Integer mrWhitesCount;
    private List<String> localPlayerNames; // For LOCAL_PASS mode
}
