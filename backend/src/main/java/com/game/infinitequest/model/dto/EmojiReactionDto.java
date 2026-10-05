package com.game.infinitequest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmojiReactionDto {
    private String id;
    private String emoji;
    private String senderName;
    private long timestamp;
}
