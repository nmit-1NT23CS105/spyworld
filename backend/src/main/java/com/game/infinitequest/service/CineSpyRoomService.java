package com.game.infinitequest.service;

import com.game.infinitequest.model.CineSpyPlayer;
import com.game.infinitequest.model.CineSpyRoom;
import com.game.infinitequest.model.WordPair;
import com.game.infinitequest.model.dto.*;
import com.game.infinitequest.model.PlayerProfileEntity;
import com.game.infinitequest.repository.PlayerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CineSpyRoomService {

    private final WordPackService wordPackService;
    private final GeminiCineSpyService geminiCineSpyService;
    private final PlayerProfileRepository playerProfileRepo;

    private final Map<String, CineSpyRoom> rooms = new ConcurrentHashMap<>();
    private final Random random = new Random();

    // Indian Cinema Cinephile AI Personas
    private static final String[] AI_PERSONAS = {
            "Brahmanandam Fan (Telugu Comedy Connoisseur)",
            "Rajini Loyalist (Tamil Mass Action Critic)",
            "Bollywood Romantic (SRK & High Drama Buff)",
            "Mollywood Realist (Subtle Malayalam Film Critic)",
            "Sandalwood Mass Fan (Hero Entry & BGM Analyst)",
            "Kamal Haasan Cinephile (Deep Screenplay Investigator)",
            "Trivikram Punchline Admirer (Dialogue Analyst)",
            "Lokesh Kanagaraj Universe Tracker (Thriller Sleuth)"
    };

    public CineSpyRoom createRoom(CreateRoomRequest req) {
        String code = "SPY-" + (100 + random.nextInt(900));
        String mode = (req.getGameMode() != null ? req.getGameMode().toUpperCase() : "SOLO_AI");
        String category = (req.getPackCategory() != null ? req.getPackCategory().toUpperCase() : "ALL_INDIAN_CINEMA");
        String ruleMode = (req.getGameRuleMode() != null ? req.getGameRuleMode().toUpperCase() : "CLASSIC");
        String language = (req.getMovieLanguage() != null ? req.getMovieLanguage().toUpperCase() : "ALL_INDIAN");
        String difficulty = (req.getMovieDifficulty() != null ? req.getMovieDifficulty().toUpperCase() : "EASY");

        int clueTimer = (req.getClueTimerSeconds() != null && req.getClueTimerSeconds() > 0) ? req.getClueTimerSeconds() : 30;
        int discTimer = (req.getDiscussionTimerSeconds() != null && req.getDiscussionTimerSeconds() > 0) ? req.getDiscussionTimerSeconds() : 60;
        int voteTimer = (req.getVotingTimerSeconds() != null && req.getVotingTimerSeconds() > 0) ? req.getVotingTimerSeconds() : 30;

        // Player count: min 4, max 20
        int totalP = Math.max(4, Math.min(20, req.getTotalPlayers() != null && req.getTotalPlayers() > 0 ? req.getTotalPlayers() : 5));

        // Determine special roles based on mode rules
        int undercovers = 1;
        int mrWhites = 0;

        switch (ruleMode) {
            case "MR_WHITE":
                undercovers = 1;
                mrWhites = 1;
                break;
            case "DOUBLE_UNDERCOVER":
                undercovers = 2;
                mrWhites = 0;
                break;
            case "RANDOM_SPY":
                if (totalP <= 5) {
                    undercovers = 1;
                    mrWhites = 0;
                } else if (totalP <= 8) {
                    undercovers = 1;
                    mrWhites = 1;
                } else {
                    undercovers = 2;
                    mrWhites = 1;
                }
                break;
            case "CLASSIC":
            default:
                undercovers = 1;
                mrWhites = 0;
                break;
        }

        // Custom override if explicitly passed
        if (req.getUndercoversCount() != null) undercovers = req.getUndercoversCount();
        if (req.getMrWhitesCount() != null) mrWhites = req.getMrWhitesCount();

        List<CineSpyPlayer> players = new ArrayList<>();
        String hostName = (req.getHostName() != null && !req.getHostName().isBlank()) ? req.getHostName().trim() : "Player 1";

        CineSpyPlayer host = CineSpyPlayer.builder()
                .id("player-host")
                .name(hostName)
                .isHost(true)
                .isAi(false)
                .avatar("🎬")
                .build();
        players.add(host);

        if ("SOLO_AI".equals(mode)) {
            int botCount = totalP - 1;
            for (int i = 0; i < botCount; i++) {
                String persona = AI_PERSONAS[i % AI_PERSONAS.length];
                String botName = "AI " + persona.split(" ")[0];
                players.add(CineSpyPlayer.builder()
                        .id("bot-" + (i + 1))
                        .name(botName)
                        .isHost(false)
                        .isAi(true)
                        .persona(persona)
                        .avatar("🤖")
                        .build());
            }
        } else if ("LOCAL_PASS".equals(mode)) {
            List<String> names = req.getLocalPlayerNames();
            if (names != null && !names.isEmpty()) {
                players.clear();
                for (int i = 0; i < Math.min(20, names.size()); i++) {
                    players.add(CineSpyPlayer.builder()
                            .id("local-" + (i + 1))
                            .name(names.get(i).trim())
                            .isHost(i == 0)
                            .isAi(false)
                            .avatar(i % 2 == 0 ? "🎭" : "🎬")
                            .build());
                }
            } else {
                for (int i = 2; i <= totalP; i++) {
                    players.add(CineSpyPlayer.builder()
                            .id("local-" + i)
                            .name("Player " + i)
                            .isHost(false)
                            .isAi(false)
                            .avatar("🎭")
                            .build());
                }
            }
        }

        CineSpyRoom room = CineSpyRoom.builder()
                .roomCode(code)
                .gameMode(mode)
                .status("LOBBY")
                .packCategory(category)
                .gameRuleMode(ruleMode)
                .movieLanguage(language)
                .movieDifficulty(difficulty)
                .clueTimerSeconds(clueTimer)
                .discussionTimerSeconds(discTimer)
                .votingTimerSeconds(voteTimer)
                .undercoversCount(undercovers)
                .mrWhitesCount(mrWhites)
                .players(players)
                .createdAt(System.currentTimeMillis())
                .gameLogs(new ArrayList<>(List.of("Room created: " + code + " in " + mode + " mode (" + ruleMode + ").")))
                .build();

        rooms.put(code, room);
        return room;
    }

    public CineSpyRoom getRoom(String roomCode) {
        return rooms.get(roomCode != null ? roomCode.toUpperCase() : "");
    }

    public CineSpyRoom joinRoom(JoinRoomRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());
        if (!"LOBBY".equals(room.getStatus())) throw new IllegalStateException("Game already in progress!");

        if (room.getPlayers().size() >= 20) {
            throw new IllegalStateException("Room is full! Maximum 20 players allowed.");
        }

        String name = (req.getPlayerName() != null && !req.getPlayerName().isBlank()) ? req.getPlayerName().trim() : "Guest";
        CineSpyPlayer newPlayer = CineSpyPlayer.builder()
                .id("player-" + System.currentTimeMillis() % 10000)
                .name(name)
                .isHost(false)
                .isAi(false)
                .avatar("🍿")
                .build();

        room.getPlayers().add(newPlayer);
        room.getGameLogs().add(name + " joined the lobby.");
        return room;
    }

    public CineSpyRoom startGame(String roomCode) {
        CineSpyRoom room = getRoom(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        // Fetch Non-Repeating Movie Pair
        if (room.getUsedPairKeys() == null) {
            room.setUsedPairKeys(new HashSet<>());
        }

        String targetCategory = room.getPackCategory();
        if (targetCategory == null || targetCategory.isBlank() || "ALL".equalsIgnoreCase(targetCategory)) {
            targetCategory = room.getMovieLanguage() != null ? room.getMovieLanguage() : "ALL_INDIAN_CINEMA";
        }

        WordPair pair = wordPackService.getUnusedPair(targetCategory, room.getUsedPairKeys());
        room.getUsedPairKeys().add(pair.getCanonicalKey());
        room.setMatchesPlayedInRoom(room.getMatchesPlayedInRoom() + 1);

        boolean swap = random.nextBoolean();
        String civil = swap ? pair.getWordA() : pair.getWordB();
        String under = swap ? pair.getWordB() : pair.getWordA();

        room.setCivilianWord(civil); // Majority Movie
        room.setUndercoverWord(under); // Undercover Movie

        List<CineSpyPlayer> list = new ArrayList<>(room.getPlayers());
        Collections.shuffle(list);

        int total = list.size();
        int whites = Math.min(room.getMrWhitesCount(), Math.max(0, total / 4));
        int undercovers = Math.min(room.getUndercoversCount(), Math.max(1, total / 3));

        // Assign Roles: Section 3, 4, 5
        for (int i = 0; i < total; i++) {
            CineSpyPlayer p = list.get(i);
            p.setEliminated(false);
            p.setCurrentClue(null);
            p.setClueHistory(new ArrayList<>());

            if (i < whites) {
                p.setRole("MR_WHITE");
                p.setSecretWord(""); // Has no movie!
            } else if (i < whites + undercovers) {
                p.setRole("UNDERCOVER");
                p.setSecretWord(under);
            } else {
                p.setRole("NORMAL");
                p.setSecretWord(civil);
            }
        }

        // Section 15: Randomly determine speaking order (first speaker not always Player 1)
        List<String> order = list.stream().map(CineSpyPlayer::getId).collect(Collectors.toList());
        Collections.shuffle(order);
        room.setSpeakingOrder(order);
        room.setCurrentSpeakerIndex(0);
        room.setRoundNumber(1);
        room.setVotes(new HashMap<>());
        room.setVoteTally(new HashMap<>());
        room.setTiedCandidateIds(new ArrayList<>());
        room.setRevote(false);
        room.setEliminatedPlayerId(null);
        room.setEliminatedPlayerName(null);
        room.setEliminatedPlayerRole(null);
        room.setEliminationMessage(null);
        room.setWinner(null);
        room.setWhiteGuess(null);
        room.setWhiteGuessSuccess(null);

        room.setStatus("ROLE_REVEAL");
        room.getGameLogs().add("Match #" + room.getMatchesPlayedInRoom() + " started! Movie assignments distributed.");

        return room;
    }

    public CineSpyRoom proceedToClueRound(String roomCode) {
        CineSpyRoom room = getRoom(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        room.setStatus("CLUE_ROUND");
        room.setCurrentSpeakerIndex(0);
        room.getGameLogs().add("Clue Phase Round " + room.getRoundNumber() + " begins. Give clues carefully!");

        processAiTurnsIfNeeded(room);
        return room;
    }

    public CineSpyRoom submitClue(SubmitClueRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());

        CineSpyPlayer speaker = getPlayerById(room, req.getPlayerId());
        if (speaker != null) {
            String clue = (req.getClueText() != null ? req.getClueText().trim() : "Secret clue");
            speaker.setCurrentClue(clue);
            speaker.getClueHistory().add(clue);
            room.getGameLogs().add(speaker.getName() + " gave clue: \"" + clue + "\"");
        }

        advanceSpeaker(room);
        return room;
    }

    private void advanceSpeaker(CineSpyRoom room) {
        List<String> aliveOrder = room.getSpeakingOrder().stream()
                .filter(id -> {
                    CineSpyPlayer p = getPlayerById(room, id);
                    return p != null && !p.isEliminated();
                })
                .collect(Collectors.toList());

        int nextIdx = room.getCurrentSpeakerIndex() + 1;

        if (nextIdx >= aliveOrder.size()) {
            // Section 17: All players gave clues -> Begin DISCUSSION phase!
            room.setStatus("DISCUSSION");
            room.getGameLogs().add("All clues received! Entering Discussion Phase: Discuss who seems suspicious!");
        } else {
            room.setCurrentSpeakerIndex(nextIdx);
            processAiTurnsIfNeeded(room);
        }
    }

    private void processAiTurnsIfNeeded(CineSpyRoom room) {
        if (!"CLUE_ROUND".equals(room.getStatus())) return;

        List<String> aliveOrder = room.getSpeakingOrder().stream()
                .filter(id -> {
                    CineSpyPlayer p = getPlayerById(room, id);
                    return p != null && !p.isEliminated();
                })
                .collect(Collectors.toList());

        while (room.getCurrentSpeakerIndex() < aliveOrder.size()) {
            String currentId = aliveOrder.get(room.getCurrentSpeakerIndex());
            CineSpyPlayer currentP = getPlayerById(room, currentId);

            if (currentP != null && currentP.isAi()) {
                List<String> prevClues = room.getPlayers().stream()
                        .map(CineSpyPlayer::getCurrentClue)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());

                String botClue = geminiCineSpyService.generateAiBotClue(
                        currentP.getSecretWord(),
                        currentP.getRole(),
                        currentP.getPersona(),
                        prevClues
                );

                currentP.setCurrentClue(botClue);
                currentP.getClueHistory().add(botClue);
                room.getGameLogs().add(currentP.getName() + " (AI) gave clue: \"" + botClue + "\"");

                int next = room.getCurrentSpeakerIndex() + 1;
                if (next >= aliveOrder.size()) {
                    // Section 17: Discussion Phase
                    room.setStatus("DISCUSSION");
                    room.getGameLogs().add("All clues completed! Entering Discussion Phase: Discuss who seems suspicious!");
                    break;
                } else {
                    room.setCurrentSpeakerIndex(next);
                }
            } else {
                // Next speaker is Human, wait for their input
                break;
            }
        }
    }

    /**
     * Move from DISCUSSION to VOTING (Section 18)
     */
    public CineSpyRoom proceedToVoting(String roomCode) {
        CineSpyRoom room = getRoom(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        room.setStatus("VOTING");
        room.setVotes(new HashMap<>());
        room.setRevote(false);
        room.setTiedCandidateIds(new ArrayList<>());
        room.getGameLogs().add("Discussion closed. Secret voting begins!");

        if ("SOLO_AI".equals(room.getGameMode())) {
            simulateAiVotes(room, null);
        }

        return room;
    }

    private void simulateAiVotes(CineSpyRoom room, List<String> allowedTargets) {
        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());
        List<CineSpyPlayer> aiBots = alive.stream().filter(CineSpyPlayer::isAi).collect(Collectors.toList());

        for (CineSpyPlayer bot : aiBots) {
            List<CineSpyPlayer> suspects;
            if (allowedTargets != null && !allowedTargets.isEmpty()) {
                suspects = alive.stream()
                        .filter(p -> allowedTargets.contains(p.getId()) && !p.getId().equals(bot.getId()))
                        .collect(Collectors.toList());
            } else {
                suspects = alive.stream().filter(p -> !p.getId().equals(bot.getId())).collect(Collectors.toList());
            }

            if (!suspects.isEmpty()) {
                CineSpyPlayer picked = suspects.get(random.nextInt(suspects.size()));
                room.getVotes().put(bot.getId(), picked.getId());
            }
        }
    }

    public CineSpyRoom castVote(CastVoteRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());

        if (req.getVoterId() == null || req.getSuspectId() == null || req.getSuspectId().isBlank()) {
            throw new IllegalArgumentException("Voter ID and Suspect ID must not be empty!");
        }

        // Validate self-vote prevention (Section 18)
        if (req.getVoterId().equals(req.getSuspectId())) {
            throw new IllegalArgumentException("Players cannot vote for themselves!");
        }

        // If revote, validate target is in tied list
        if (room.isRevote() && !room.getTiedCandidateIds().isEmpty()) {
            if (!room.getTiedCandidateIds().contains(req.getSuspectId())) {
                throw new IllegalArgumentException("Revote is restricted strictly to tied candidates!");
            }
        }

        room.getVotes().put(req.getVoterId(), req.getSuspectId());
        CineSpyPlayer voter = getPlayerById(room, req.getVoterId());
        CineSpyPlayer suspect = getPlayerById(room, req.getSuspectId());

        if (voter != null && suspect != null) {
            room.getGameLogs().add(voter.getName() + " cast their secret vote.");
        }

        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());
        long humanAliveCount = alive.stream().filter(p -> !p.isAi()).count();
        long humanVotesCount = alive.stream().filter(p -> !p.isAi()).filter(p -> room.getVotes().containsKey(p.getId())).count();

        // When all alive humans have voted, resolve voting
        if (humanVotesCount >= humanAliveCount) {
            resolveVoting(room);
        }

        return room;
    }

    private void resolveVoting(CineSpyRoom room) {
        // Tally votes
        Map<String, Integer> tally = new HashMap<>();
        room.getVotes().values().forEach(targetId -> {
            if (targetId != null) {
                tally.put(targetId, tally.getOrDefault(targetId, 0) + 1);
            }
        });
        room.setVoteTally(tally);

        // Find max votes
        int maxVotes = -1;
        for (int count : tally.values()) {
            if (count > maxVotes) {
                maxVotes = count;
            }
        }

        List<String> topVotedIds = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : tally.entrySet()) {
            if (entry.getValue() == maxVotes) {
                topVotedIds.add(entry.getKey());
            }
        }

        // Section 26: Tie Voting Rule
        if (topVotedIds.size() > 1 && maxVotes > 0) {
            if (!room.isRevote()) {
                // First tie: conduct a revote between tied candidates
                room.setRevote(true);
                room.setTiedCandidateIds(topVotedIds);
                room.setVotes(new HashMap<>());
                room.setStatus("VOTING");

                List<String> tiedNames = topVotedIds.stream()
                        .map(id -> {
                            CineSpyPlayer p = getPlayerById(room, id);
                            return p != null ? p.getName() : id;
                        })
                        .toList();
                room.getGameLogs().add("⚠️ TIE DETECTED between: " + String.join(", ", tiedNames) + "! Conducting a Revote!");

                if ("SOLO_AI".equals(room.getGameMode())) {
                    simulateAiVotes(room, topVotedIds);
                }
                return;
            } else {
                // Revote is still tied: Section 26 default rule: No elimination. Start another clue round!
                room.setRevote(false);
                room.setTiedCandidateIds(new ArrayList<>());
                room.setRoundNumber(room.getRoundNumber() + 1);
                room.setCurrentSpeakerIndex(0);
                room.setStatus("CLUE_ROUND");
                room.getGameLogs().add("⚖️ Revote ended in a tie! No elimination. Entering Round " + room.getRoundNumber() + " with a new clue round.");
                processAiTurnsIfNeeded(room);
                return;
            }
        }

        // Single eliminated player!
        String eliminatedId = topVotedIds.isEmpty() ? null : topVotedIds.get(0);
        if (eliminatedId != null) {
            CineSpyPlayer victim = getPlayerById(room, eliminatedId);
            if (victim != null) {
                victim.setEliminated(true);
                room.setEliminatedPlayerId(victim.getId());
                room.setEliminatedPlayerName(victim.getName());
                room.setEliminatedPlayerRole(victim.getRole());

                // Section 20 Role Reveal Message
                String msg;
                if ("NORMAL".equalsIgnoreCase(victim.getRole()) || "CIVILIAN".equalsIgnoreCase(victim.getRole())) {
                    msg = victim.getName() + " WAS NORMAL. You eliminated an innocent player!";
                } else if ("UNDERCOVER".equalsIgnoreCase(victim.getRole())) {
                    msg = victim.getName() + " WAS THE UNDERCOVER. THE SPY HAS BEEN FOUND!";
                } else if ("MR_WHITE".equalsIgnoreCase(victim.getRole())) {
                    msg = victim.getName() + " WAS MR. WHITE!";
                } else {
                    msg = victim.getName() + " was eliminated!";
                }

                room.setEliminationMessage(msg);
                room.setStatus("VOTE_RESULT");
                room.getGameLogs().add("💥 " + msg);
            }
        }
    }

    /**
     * Advance from VOTE_RESULT screen to next stage
     */
    public CineSpyRoom proceedFromVoteResult(String roomCode) {
        CineSpyRoom room = getRoom(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        // If eliminated player was MR_WHITE, activate final guess (Section 21)
        if ("MR_WHITE".equalsIgnoreCase(room.getEliminatedPlayerRole())) {
            room.setStatus("WHITE_GUESS");
            room.getGameLogs().add("Mr. White gets ONE FINAL GUESS to deduce the majority movie!");
            return room;
        }

        // Otherwise check win conditions
        checkWinConditions(room);
        return room;
    }

    public CineSpyRoom submitWhiteGuess(WhiteGuessRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());

        String guess = (req.getGuessWord() != null ? req.getGuessWord().trim() : "");
        String actualMovie = room.getCivilianWord() != null ? room.getCivilianWord().trim() : "";

        room.setWhiteGuess(guess);

        // Normalized matching
        String cleanGuess = guess.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        String cleanActual = actualMovie.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        boolean correct = cleanGuess.equalsIgnoreCase(cleanActual) || cleanActual.contains(cleanGuess) && cleanGuess.length() >= 4;

        room.setWhiteGuessSuccess(correct);

        if (correct) {
            // Section 21 & 25: MR. WHITE WINS!
            room.setStatus("GAME_OVER");
            room.setWinner("MR_WHITE");
            room.setWinReason("MR. WHITE GUESSED THE MOVIE! Mr. White stole the victory with '" + room.getCivilianWord() + "'!");
            room.getGameLogs().add("🏆 MR. WHITE WINS! Correctly named the majority movie: " + room.getCivilianWord());
            calculateAndAwardPoints(room);
        } else {
            room.getGameLogs().add("❌ Mr. White guessed incorrectly! ('" + guess + "' != '" + room.getCivilianWord() + "'). Normal players survive!");
            checkWinConditions(room);
        }

        return room;
    }

    private void checkWinConditions(CineSpyRoom room) {
        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());
        long normCount = alive.stream().filter(p -> "NORMAL".equalsIgnoreCase(p.getRole()) || "CIVILIAN".equalsIgnoreCase(p.getRole())).count();
        long underCount = alive.stream().filter(p -> "UNDERCOVER".equalsIgnoreCase(p.getRole())).count();
        long whiteCount = alive.stream().filter(p -> "MR_WHITE".equalsIgnoreCase(p.getRole())).count();

        // 1. All special roles eliminated -> Normal team wins! (Section 25)
        if (underCount == 0 && whiteCount == 0) {
            room.setStatus("GAME_OVER");
            room.setWinner("NORMAL");
            room.setWinReason("All Undercover spies and Mr. White were identified and eliminated! Normal players win!");
            room.getGameLogs().add("🏆 NORMAL PLAYERS WIN! Majority movie was: " + room.getCivilianWord());
            calculateAndAwardPoints(room);
            return;
        }

        // 2. Undercover reaches parity (Undercover >= Normal) -> Undercover wins! (Section 25)
        if ((underCount + whiteCount) >= normCount) {
            room.setStatus("GAME_OVER");
            if (underCount > 0) {
                room.setWinner("UNDERCOVER");
                room.setWinReason("Undercover spies outsmarted the normal players! Parity achieved!");
                room.getGameLogs().add("🏆 UNDERCOVER WINS! Undercover movie was: " + room.getUndercoverWord());
            } else {
                room.setWinner("MR_WHITE");
                room.setWinReason("Mr. White survived undetected!");
                room.getGameLogs().add("🏆 MR. WHITE WINS!");
            }
            calculateAndAwardPoints(room);
            return;
        }

        // 3. Continue to next round (Section 24)
        room.setStatus("CLUE_ROUND");
        room.setRoundNumber(room.getRoundNumber() + 1);
        room.setCurrentSpeakerIndex(0);
        room.setVotes(new HashMap<>());
        room.setVoteTally(new HashMap<>());
        room.setRevote(false);
        room.setTiedCandidateIds(new ArrayList<>());
        room.getGameLogs().add("Entering Round " + room.getRoundNumber() + " with remaining active players.");

        processAiTurnsIfNeeded(room);
    }

    private void calculateAndAwardPoints(CineSpyRoom room) {
        String winner = room.getWinner();
        if (winner == null) return;

        for (CineSpyPlayer player : room.getPlayers()) {
            int earned = 0;
            String role = player.getRole();
            boolean isAlive = !player.isEliminated();

            if ("NORMAL".equalsIgnoreCase(winner) || "CIVILIANS".equalsIgnoreCase(winner)) {
                if ("NORMAL".equalsIgnoreCase(role) || "CIVILIAN".equalsIgnoreCase(role)) {
                    earned += isAlive ? 3 : 2;
                }
            } else if ("UNDERCOVER".equalsIgnoreCase(winner)) {
                if ("UNDERCOVER".equalsIgnoreCase(role)) {
                    earned += isAlive ? 4 : 2;
                }
            } else if ("MR_WHITE".equalsIgnoreCase(winner)) {
                if ("MR_WHITE".equalsIgnoreCase(role)) {
                    earned += 5;
                }
            }

            // Detective bonus: +1 point if voted for caught spy/white
            if (room.getVotes() != null && room.getVotes().containsKey(player.getId())) {
                String votedTargetId = room.getVotes().get(player.getId());
                CineSpyPlayer target = getPlayerById(room, votedTargetId);
                if (target != null && target.isEliminated() && !"NORMAL".equalsIgnoreCase(target.getRole()) && !"CIVILIAN".equalsIgnoreCase(target.getRole())) {
                    earned += 1;
                }
            }

            player.setRoundPointsEarned(earned);
            player.setScore(player.getScore() + earned);

            try {
                if (!player.isAi() && player.getName() != null && !player.getName().isBlank()) {
                    PlayerProfileEntity profile = playerProfileRepo.findById(player.getName())
                            .orElse(PlayerProfileEntity.builder()
                                    .playerName(player.getName())
                                    .favoriteAvatar(player.getAvatar())
                                    .totalScore(0)
                                    .gamesPlayed(0)
                                    .wins(0)
                                    .build());

                    profile.setTotalScore(profile.getTotalScore() + earned);
                    profile.setGamesPlayed(profile.getGamesPlayed() + 1);

                    boolean isWinner = (("NORMAL".equalsIgnoreCase(winner) || "CIVILIANS".equalsIgnoreCase(winner)) && ("NORMAL".equalsIgnoreCase(role) || "CIVILIAN".equalsIgnoreCase(role)))
                            || ("UNDERCOVER".equalsIgnoreCase(winner) && "UNDERCOVER".equalsIgnoreCase(role))
                            || ("MR_WHITE".equalsIgnoreCase(winner) && "MR_WHITE".equalsIgnoreCase(role));
                    if (isWinner) {
                        profile.setWins(profile.getWins() + 1);
                    }
                    profile.setLastPlayedAt(System.currentTimeMillis());
                    playerProfileRepo.save(profile);
                }
            } catch (Throwable ex) {
                System.err.println("Notice: Could not persist player profile: " + ex.getMessage());
            }
        }
    }

    public List<PlayerProfileEntity> getLeaderboard() {
        return playerProfileRepo.findTop20ByOrderByTotalScoreDesc();
    }

    public CineSpyRoom addReaction(ReactRequest req) {
        if (req == null || req.getRoomCode() == null) return null;
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) return null;

        EmojiReactionDto reaction = EmojiReactionDto.builder()
                .id(UUID.randomUUID().toString())
                .emoji(req.getEmoji() != null ? req.getEmoji() : "🕵️")
                .senderName(req.getSenderName() != null ? req.getSenderName() : "Anonymous")
                .timestamp(System.currentTimeMillis())
                .build();

        room.getRecentReactions().add(reaction);
        if (room.getRecentReactions().size() > 20) {
            room.setRecentReactions(new ArrayList<>(room.getRecentReactions().subList(room.getRecentReactions().size() - 20, room.getRecentReactions().size())));
        }

        return room;
    }

    private CineSpyPlayer getPlayerById(CineSpyRoom room, String id) {
        if (room == null || id == null) return null;
        return room.getPlayers().stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null);
    }
}
