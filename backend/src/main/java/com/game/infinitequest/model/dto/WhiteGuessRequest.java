package com.game.infinitequest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteGuessRequest {
    private String roomCode;
    private String playerId;
    private String guessWord;
}
