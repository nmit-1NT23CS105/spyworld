package com.game.infinitequest.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordPair {
    private String category;
    private String wordA;
    private String wordB;

    public String getCanonicalKey() {
        String a = wordA != null ? wordA.trim().toLowerCase() : "";
        String b = wordB != null ? wordB.trim().toLowerCase() : "";
        return a.compareTo(b) < 0 ? a + ":::" + b : b + ":::" + a;
    }
}
