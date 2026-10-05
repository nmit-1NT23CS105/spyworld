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

    private static final String[] AI_PERSONAS = {
            "Tech Geek (Silicon Valley Hacker)",
            "Foodie Critic (Biryani & Chai Connoisseur)",
            "Hostel Senior (College Backbencher)",
            "Sports Analyst (Cricket & Football Fanatic)",
            "Movie Buff (Cinema Connoisseur)",
            "Wanderlust Nomad (Backpacker & Traveler)",
            "Comedy King (Brahmanandam)"
    };

    public CineSpyRoom createRoom(CreateRoomRequest req) {
        String code = "SPY-" + (100 + random.nextInt(900));
        String mode = (req.getGameMode() != null ? req.getGameMode().toUpperCase() : "SOLO_AI");
        String category = (req.getPackCategory() != null ? req.getPackCategory().toUpperCase() : "ALL_REAL_WORLD");

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

        int totalP = (req.getTotalPlayers() != null && req.getTotalPlayers() > 0) ? req.getTotalPlayers() : 5;
        int undercovers = (req.getUndercoversCount() != null && req.getUndercoversCount() > 0) ? req.getUndercoversCount() : 1;
        int mrWhites = (req.getMrWhitesCount() != null) ? req.getMrWhitesCount() : 1;

        if ("SOLO_AI".equals(mode)) {
            int botCount = Math.max(3, Math.min(6, totalP - 1));
            for (int i = 0; i < botCount; i++) {
                String persona = AI_PERSONAS[i % AI_PERSONAS.length];
                players.add(CineSpyPlayer.builder()
                        .id("bot-" + (i + 1))
                        .name("AI " + persona.split(" ")[0])
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
                for (int i = 0; i < names.size(); i++) {
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
                .undercoversCount(undercovers)
                .mrWhitesCount(mrWhites)
                .players(players)
                .createdAt(System.currentTimeMillis())
                .gameLogs(new ArrayList<>(List.of("Room created: " + code + " in " + mode + " mode.")))
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

        // Fetch Non-Repeating Word Pair
        if (room.getUsedPairKeys() == null) {
            room.setUsedPairKeys(new HashSet<>());
        }
        WordPair pair = wordPackService.getUnusedPair(room.getPackCategory(), room.getUsedPairKeys());
        room.getUsedPairKeys().add(pair.getCanonicalKey());
        room.setMatchesPlayedInRoom(room.getMatchesPlayedInRoom() + 1);

        boolean swap = random.nextBoolean();
        String civil = swap ? pair.getWordA() : pair.getWordB();
        String under = swap ? pair.getWordB() : pair.getWordA();

        room.setCivilianWord(civil);
        room.setUndercoverWord(under);

        List<CineSpyPlayer> list = new ArrayList<>(room.getPlayers());
        Collections.shuffle(list);

        int total = list.size();
        int whites = Math.min(room.getMrWhitesCount(), Math.max(1, total / 4));
        int undercovers = Math.min(room.getUndercoversCount(), Math.max(1, total / 3));

        // Assign Roles
        for (int i = 0; i < total; i++) {
            CineSpyPlayer p = list.get(i);
            p.setEliminated(false);
            p.setCurrentClue(null);
            p.setClueHistory(new ArrayList<>());

            if (i < whites) {
                p.setRole("MR_WHITE");
                p.setSecretWord(""); // Has no word!
            } else if (i < whites + undercovers) {
                p.setRole("UNDERCOVER");
                p.setSecretWord(under);
            } else {
                p.setRole("CIVILIAN");
                p.setSecretWord(civil);
            }
        }

        // Setup Speaking Order
        List<String> order = list.stream().map(CineSpyPlayer::getId).collect(Collectors.toList());
        Collections.shuffle(order);
        room.setSpeakingOrder(order);
        room.setCurrentSpeakerIndex(0);
        room.setRoundNumber(1);
        room.setVotes(new HashMap<>());
        room.setEliminatedPlayerId(null);
        room.setEliminatedPlayerName(null);
        room.setEliminatedPlayerRole(null);
        room.setWinner(null);
        room.setWhiteGuess(null);
        room.setWhiteGuessSuccess(null);

        room.setStatus("ROLE_REVEAL");
        room.getGameLogs().add("Match #" + room.getMatchesPlayedInRoom() + " started! Non-repeating secret words assigned from " + room.getPackCategory() + ".");

        return room;
    }

    public CineSpyRoom proceedToClueRound(String roomCode) {
        CineSpyRoom room = getRoom(roomCode);
        if (room == null) throw new IllegalArgumentException("Room not found: " + roomCode);

        room.setStatus("CLUE_ROUND");
        room.setCurrentSpeakerIndex(0);
        room.getGameLogs().add("Round " + room.getRoundNumber() + " Clue Phase begins!");

        // If the first speaker is an AI bot in SOLO_AI mode, auto-advance
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
            room.getGameLogs().add(speaker.getName() + " said: \"" + clue + "\"");
        }

        // Advance to next alive speaker
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
            // All alive players gave clues! Advance to VOTING
            room.setStatus("VOTING");
            room.setVotes(new HashMap<>());
            room.getGameLogs().add("All clues received! Time to discuss and cast elimination votes!");

            // If SOLO_AI mode, trigger bots to vote
            if ("SOLO_AI".equals(room.getGameMode())) {
                simulateAiVotes(room);
            }
        } else {
            room.setCurrentSpeakerIndex(nextIdx);
            // Check if next speaker is AI
            processAiTurnsIfNeeded(room);
        }
    }

    private void processAiTurnsIfNeeded(CineSpyRoom room) {
        if (!"SOLO_AI".equals(room.getGameMode()) || !"CLUE_ROUND".equals(room.getStatus())) return;

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
                    room.setStatus("VOTING");
                    room.setVotes(new HashMap<>());
                    room.getGameLogs().add("All clues completed! Entering elimination voting.");
                    simulateAiVotes(room);
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

    private void simulateAiVotes(CineSpyRoom room) {
        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());
        List<CineSpyPlayer> aiBots = alive.stream().filter(CineSpyPlayer::isAi).collect(Collectors.toList());

        for (CineSpyPlayer bot : aiBots) {
            // Pick a suspect other than themselves
            List<CineSpyPlayer> suspects = alive.stream().filter(p -> !p.getId().equals(bot.getId())).collect(Collectors.toList());
            if (!suspects.isEmpty()) {
                CineSpyPlayer picked = suspects.get(random.nextInt(suspects.size()));
                room.getVotes().put(bot.getId(), picked.getId());
            }
        }
    }

    public CineSpyRoom castVote(CastVoteRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());

        room.getVotes().put(req.getVoterId(), req.getSuspectId());
        CineSpyPlayer voter = getPlayerById(room, req.getVoterId());
        CineSpyPlayer suspect = getPlayerById(room, req.getSuspectId());

        if (voter != null && suspect != null) {
            room.getGameLogs().add(voter.getName() + " voted against " + suspect.getName());
        }

        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());
        long humanAliveCount = alive.stream().filter(p -> !p.isAi()).count();
        long humanVotesCount = alive.stream().filter(p -> !p.isAi()).filter(p -> room.getVotes().containsKey(p.getId())).count();

        // If all alive humans voted (and bots auto-voted in AI mode), resolve voting!
        if (humanVotesCount >= humanAliveCount) {
            resolveVoting(room);
        }

        return room;
    }

    private void resolveVoting(CineSpyRoom room) {
        // Tally votes
        Map<String, Integer> tally = new HashMap<>();
        room.getVotes().values().forEach(targetId -> tally.put(targetId, tally.getOrDefault(targetId, 0) + 1));

        String eliminatedId = null;
        int maxVotes = -1;
        for (Map.Entry<String, Integer> entry : tally.entrySet()) {
            if (entry.getValue() > maxVotes) {
                maxVotes = entry.getValue();
                eliminatedId = entry.getKey();
            }
        }

        if (eliminatedId != null) {
            CineSpyPlayer victim = getPlayerById(room, eliminatedId);
            if (victim != null) {
                victim.setEliminated(true);
                room.setEliminatedPlayerId(victim.getId());
                room.setEliminatedPlayerName(victim.getName());
                room.setEliminatedPlayerRole(victim.getRole());
                room.getGameLogs().add("💥 " + victim.getName() + " was eliminated! Role: " + victim.getRole());

                // If eliminated player was MR_WHITE, trigger White Guess stage!
                if ("MR_WHITE".equalsIgnoreCase(victim.getRole())) {
                    room.setStatus("WHITE_GUESS");
                    room.getGameLogs().add("Mr. White was caught! They get ONE GUESS to steal the win!");
                    return;
                }
            }
        }

        checkWinCondition(room);
    }

    public CineSpyRoom submitWhiteGuess(WhiteGuessRequest req) {
        CineSpyRoom room = getRoom(req.getRoomCode());
        if (room == null) throw new IllegalArgumentException("Room not found: " + req.getRoomCode());

        String guess = (req.getGuessWord() != null ? req.getGuessWord().trim() : "");
        room.setWhiteGuess(guess);

        boolean isCorrect = geminiCineSpyService.evaluateWhiteGuess(room.getCivilianWord(), guess);
        room.setWhiteGuessSuccess(isCorrect);

        if (isCorrect) {
            room.setStatus("GAME_OVER");
            room.setWinner("MR_WHITE");
            room.setWinReason("Mr. White correctly guessed the secret civilian word: '" + room.getCivilianWord() + "'!");
            room.getGameLogs().add("🏆 MR. WHITE WINS! Guessed the word: \"" + guess + "\"");
            calculateAndAwardPoints(room);
        } else {
            room.getGameLogs().add("❌ Mr. White's guess was incorrect! Guess was: \"" + guess + "\"");
            checkWinCondition(room);
        }

        return room;
    }

    private void checkWinCondition(CineSpyRoom room) {
        List<CineSpyPlayer> alive = room.getPlayers().stream().filter(p -> !p.isEliminated()).collect(Collectors.toList());

        long civCount = alive.stream().filter(p -> "CIVILIAN".equalsIgnoreCase(p.getRole())).count();
        long underCount = alive.stream().filter(p -> "UNDERCOVER".equalsIgnoreCase(p.getRole())).count();
        long whiteCount = alive.stream().filter(p -> "MR_WHITE".equalsIgnoreCase(p.getRole())).count();

        // 1. All infiltrators eliminated -> Civilians win!
        if (underCount == 0 && whiteCount == 0) {
            room.setStatus("GAME_OVER");
            room.setWinner("CIVILIANS");
            room.setWinReason("All Undercover spies and Mr. White were identified and voted out! Civilians win!");
            room.getGameLogs().add("🏆 CIVILIANS WIN! Secret word was: " + room.getCivilianWord());
            calculateAndAwardPoints(room);
            return;
        }

        // 2. Infiltrators reach parity (Undercover + White >= Civilians) -> Infiltrators win!
        if ((underCount + whiteCount) >= civCount) {
            room.setStatus("GAME_OVER");
            if (underCount > 0) {
                room.setWinner("UNDERCOVER");
                room.setWinReason("Undercover spies outsmarted the civilians! Parity achieved!");
                room.getGameLogs().add("🏆 UNDERCOVER WINS! Decoy word was: " + room.getUndercoverWord());
            } else {
                room.setWinner("MR_WHITE");
                room.setWinReason("Mr. White survived undetected!");
                room.getGameLogs().add("🏆 MR. WHITE WINS!");
            }
            calculateAndAwardPoints(room);
            return;
        }

        // 3. Game continues to next round
        room.setStatus("CLUE_ROUND");
        room.setRoundNumber(room.getRoundNumber() + 1);
        room.setCurrentSpeakerIndex(0);
        room.setVotes(new HashMap<>());
        room.getGameLogs().add("Entering Round " + room.getRoundNumber() + " with remaining players.");

        processAiTurnsIfNeeded(room);
    }

    private void calculateAndAwardPoints(CineSpyRoom room) {
        String winner = room.getWinner();
        if (winner == null) return;

        for (CineSpyPlayer player : room.getPlayers()) {
            int earned = 0;
            String role = player.getRole();
            boolean isAlive = !player.isEliminated();

            if ("CIVILIANS".equalsIgnoreCase(winner)) {
                if ("CIVILIAN".equalsIgnoreCase(role)) {
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

            // Detective bonus: +1 point if player correctly voted for an eliminated spy/Mr White
            if (room.getVotes() != null && room.getVotes().containsKey(player.getId())) {
                String votedTargetId = room.getVotes().get(player.getId());
                CineSpyPlayer target = getPlayerById(room, votedTargetId);
                if (target != null && target.isEliminated() && !"CIVILIAN".equalsIgnoreCase(target.getRole())) {
                    earned += 1;
                }
            }

            player.setRoundPointsEarned(earned);
            player.setScore(player.getScore() + earned);

            // Persist human player career stats to database
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
                    boolean isWinner = ("CIVILIANS".equalsIgnoreCase(winner) && "CIVILIAN".equalsIgnoreCase(role))
                            || ("UNDERCOVER".equalsIgnoreCase(winner) && "UNDERCOVER".equalsIgnoreCase(role))
                            || ("MR_WHITE".equalsIgnoreCase(winner) && "MR_WHITE".equalsIgnoreCase(role));
                    if (isWinner) {
                        profile.setWins(profile.getWins() + 1);
                    }
                    profile.setLastPlayedAt(System.currentTimeMillis());
                    playerProfileRepo.save(profile);
                }
            } catch (Exception ex) {
                System.err.println("Notice: Could not persist player profile: " + ex.getMessage());
            }
        }
        room.getGameLogs().add("⭐ Points calculated and updated for all players!");
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
