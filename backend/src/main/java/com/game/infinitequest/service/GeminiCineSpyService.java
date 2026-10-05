package com.game.infinitequest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.game.infinitequest.model.WordPair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiCineSpyService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    public String generateAiBotClue(String secretWord, String role, String botPersona, List<String> previousClues) {
        String persona = (botPersona != null && !botPersona.isBlank()) ? botPersona : "Clever Player";

        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String prompt;
                if ("MR_WHITE".equalsIgnoreCase(role)) {
                    prompt = "You are playing the social deduction party game 'Undercover' (Spyfall).\n" +
                            "You are playing with persona: '" + persona + "'.\n" +
                            "YOUR SECRET ROLE IS 'MR. WHITE' (INFILTRATOR): You DO NOT know the secret word!\n" +
                            "Here are the clues given so far by other players: " + (previousClues.isEmpty() ? "None yet." : String.join(", ", previousClues)) + ".\n" +
                            "Give a single clever, ambiguous 1 to 3 word clue that bluffs and blends in with the topic so nobody suspects you! Do not explain. Return ONLY the clue text:";
                } else {
                    prompt = "You are playing the social deduction party game 'Undercover' (Spyfall).\n" +
                            "You are playing with persona: '" + persona + "'.\n" +
                            "The secret word / concept is: '" + secretWord + "'.\n" +
                            "Give a single clever, subtle 1 to 3 word clue that hints at this real-world word without giving it away directly!\n" +
                            "Do not say the secret word itself. Return ONLY the 1-3 word clue text:";
                }

                Map<String, Object> textPart = Map.of("text", prompt);
                Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
                Map<String, Object> genConfig = Map.of("temperature", 0.7, "maxOutputTokens", 20);
                Map<String, Object> reqMap = Map.of(
                        "contents", List.of(contentObj),
                        "generationConfig", genConfig
                );

                String requestBody = objectMapper.writeValueAsString(reqMap);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

                String[] models = {"gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.7-flash"};
                for (String m : models) {
                    try {
                        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + apiKey;
                        String respStr = restTemplate.postForObject(url, entity, String.class);
                        if (respStr != null) {
                            JsonNode root = objectMapper.readTree(respStr);
                            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                            String cleaned = text.trim().replaceAll("[\"'\n\r]", "");
                            if (!cleaned.isBlank()) {
                                return cleaned;
                            }
                        }
                    } catch (Exception ignored) {}
                }
            } catch (Exception e) {
                System.err.println("Gemini generateAiBotClue error: " + e.getMessage());
            }
        }

        // Fast fallback clue if AI is unavailable
        return getFallbackClue(secretWord, role);
    }

    public boolean evaluateWhiteGuess(String civilianWord, String guess) {
        if (guess == null || civilianWord == null) return false;
        String cleanGuess = guess.trim().toLowerCase();
        String cleanTarget = civilianWord.trim().toLowerCase();

        // Direct equality or substring match
        if (cleanGuess.equals(cleanTarget) || cleanGuess.contains(cleanTarget) || cleanTarget.contains(cleanGuess)) {
            return true;
        }

        // Semantic check via Gemini
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String prompt = "In a game of real-world Undercover / Spyfall, the secret word was: '" + civilianWord + "'.\n" +
                        "The player's guess was: '" + guess + "'.\n" +
                        "Does this guess refer to or semantically match the target word (e.g. accounting for plurals, regional slang, brand synonyms, or spelling variations)?\n" +
                        "Respond ONLY with valid JSON: {\"isMatch\": true} or {\"isMatch\": false}";

                Map<String, Object> textPart = Map.of("text", prompt);
                Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
                Map<String, Object> genConfig = Map.of("response_mime_type", "application/json", "temperature", 0.1);
                Map<String, Object> reqMap = Map.of(
                        "contents", List.of(contentObj),
                        "generationConfig", genConfig
                );

                String requestBody = objectMapper.writeValueAsString(reqMap);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + apiKey;
                String respStr = restTemplate.postForObject(url, entity, String.class);
                if (respStr != null) {
                    JsonNode root = objectMapper.readTree(respStr);
                    String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    JsonNode result = objectMapper.readTree(text.trim());
                    return result.path("isMatch").asBoolean(false);
                }
            } catch (Exception e) {
                System.err.println("Gemini evaluateWhiteGuess error: " + e.getMessage());
            }
        }

        return false;
    }

    public List<WordPair> generateCustomWordPairs(String themePrompt) {
        List<WordPair> pairs = new ArrayList<>();
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String prompt = "You are the word-pack creator for a real-world social deduction game (Undercover / Spyfall).\n" +
                        "Theme: " + (themePrompt != null ? themePrompt : "Real-World Everyday Life & Culture") + ".\n" +
                        "Generate 6 pairs of closely related, deceptive real-world words (can be food, gadgets, places, college life, sports, cars, careers, or any real-world topic) where one is Word A (Civilian) and one is Word B (Undercover decoy).\n" +
                        "Respond ONLY with valid JSON in this format:\n" +
                        "[\n" +
                        "  {\"wordA\": \"Word 1\", \"wordB\": \"Word 2\"},\n" +
                        "  {\"wordA\": \"Word 3\", \"wordB\": \"Word 4\"}\n" +
                        "]";

                Map<String, Object> textPart = Map.of("text", prompt);
                Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
                Map<String, Object> genConfig = Map.of("response_mime_type", "application/json", "temperature", 0.7);
                Map<String, Object> reqMap = Map.of(
                        "contents", List.of(contentObj),
                        "generationConfig", genConfig
                );

                String requestBody = objectMapper.writeValueAsString(reqMap);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + apiKey;
                String respStr = restTemplate.postForObject(url, entity, String.class);
                if (respStr != null) {
                    JsonNode root = objectMapper.readTree(respStr);
                    String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    JsonNode arr = objectMapper.readTree(text.trim());
                    if (arr.isArray()) {
                        for (JsonNode item : arr) {
                            String a = item.path("wordA").asText();
                            String b = item.path("wordB").asText();
                            if (!a.isBlank() && !b.isBlank()) {
                                pairs.add(new WordPair("CUSTOM_AI", a, b));
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini generateCustomWordPairs error: " + e.getMessage());
            }
        }

        if (pairs.isEmpty()) {
            pairs.add(new WordPair("CUSTOM_AI", "Biryani", "Pulao"));
            pairs.add(new WordPair("CUSTOM_AI", "iPhone", "Android Phone"));
            pairs.add(new WordPair("CUSTOM_AI", "Cricket", "Football"));
            pairs.add(new WordPair("CUSTOM_AI", "Goa", "Manali"));
            pairs.add(new WordPair("CUSTOM_AI", "Hostel Room", "Home"));
        }
        return pairs;
    }

    private String getFallbackClue(String word, String role) {
        if ("MR_WHITE".equalsIgnoreCase(role)) {
            String[] bluffs = {"Universal favorite", "Everyday essential", "Highly popular", "Classic vibes", "Instant comfort"};
            return bluffs[random.nextInt(bluffs.length)];
        }
        String lower = (word != null ? word.toLowerCase() : "");
        if (lower.contains("biryani")) return "Dum cooked aroma";
        if (lower.contains("pulao")) return "Flavored rice delicacy";
        if (lower.contains("chai")) return "Hot brewing cup";
        if (lower.contains("coffee")) return "Caffeine morning boost";
        if (lower.contains("iphone")) return "Bitten apple logo";
        if (lower.contains("android")) return "Green robot system";
        if (lower.contains("cricket")) return "Bat and ball fever";
        if (lower.contains("football")) return "Ninety minute goals";
        if (lower.contains("hostel")) return "Midnight roommates life";
        if (lower.contains("beach")) return "Ocean wave shores";
        if (lower.contains("mountain")) return "High altitude fog";
        if (lower.contains("dog")) return "Loyal barking companion";
        if (lower.contains("cat")) return "Silent purring paws";
        return "Daily real-world favorite";
    }
}
