package com.game.infinitequest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPackRequest {
    private String themePrompt; // e.g. "Pan-Indian Villains", "Rajamouli vs Sukumar", "90s Telugu Classics"
}
