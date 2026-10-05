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
public class CustomVsRequest {
    private String category; // e.g. "CUSTOM_VS" or user-chosen name
    private String rawText;  // e.g. "Coffee vs Tea\nMarvel vs DC\niPhone vs Android"
    private List<CustomVsItem> pairs; // Optional structured input

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomVsItem {
        private String wordA;
        private String wordB;
    }
}
