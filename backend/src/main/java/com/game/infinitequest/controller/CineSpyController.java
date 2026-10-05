package com.game.infinitequest.controller;

import com.game.infinitequest.model.CineSpyRoom;
import com.game.infinitequest.model.CustomWordPairEntity;
import com.game.infinitequest.model.PlayerProfileEntity;
import com.game.infinitequest.model.WordPair;
import com.game.infinitequest.model.dto.*;
import com.game.infinitequest.service.CineSpyRoomService;
import com.game.infinitequest.service.GeminiCineSpyService;
import com.game.infinitequest.service.WordPackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cinespy")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CineSpyController {

    private final CineSpyRoomService cineSpyRoomService;
    private final WordPackService wordPackService;
    private final GeminiCineSpyService geminiCineSpyService;

    @PostMapping("/room/create")
    public ResponseEntity<CineSpyRoom> createRoom(@RequestBody CreateRoomRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.createRoom(request));
    }

    @PostMapping("/room/join")
    public ResponseEntity<CineSpyRoom> joinRoom(@RequestBody JoinRoomRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.joinRoom(request));
    }

    @GetMapping("/room/{roomCode}")
    public ResponseEntity<CineSpyRoom> getRoom(@PathVariable String roomCode) {
        CineSpyRoom room = cineSpyRoomService.getRoom(roomCode);
        if (room == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(room);
    }

    @PostMapping("/room/{roomCode}/start")
    public ResponseEntity<CineSpyRoom> startGame(@PathVariable String roomCode) {
        return ResponseEntity.ok(cineSpyRoomService.startGame(roomCode));
    }

    @PostMapping("/room/{roomCode}/proceed-clues")
    public ResponseEntity<CineSpyRoom> proceedToClueRound(@PathVariable String roomCode) {
        return ResponseEntity.ok(cineSpyRoomService.proceedToClueRound(roomCode));
    }

    @PostMapping("/room/clue")
    public ResponseEntity<CineSpyRoom> submitClue(@RequestBody SubmitClueRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.submitClue(request));
    }

    @PostMapping("/room/vote")
    public ResponseEntity<CineSpyRoom> castVote(@RequestBody CastVoteRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.castVote(request));
    }

    @PostMapping("/room/{roomCode}/proceed-voting")
    public ResponseEntity<CineSpyRoom> proceedToVoting(@PathVariable String roomCode) {
        return ResponseEntity.ok(cineSpyRoomService.proceedToVoting(roomCode));
    }

    @PostMapping("/room/{roomCode}/proceed-after-vote")
    public ResponseEntity<CineSpyRoom> proceedFromVoteResult(@PathVariable String roomCode) {
        return ResponseEntity.ok(cineSpyRoomService.proceedFromVoteResult(roomCode));
    }

    @PostMapping("/room/white-guess")
    public ResponseEntity<CineSpyRoom> submitWhiteGuess(@RequestBody WhiteGuessRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.submitWhiteGuess(request));
    }

    @PostMapping("/room/react")
    public ResponseEntity<CineSpyRoom> addReaction(@RequestBody ReactRequest request) {
        return ResponseEntity.ok(cineSpyRoomService.addReaction(request));
    }

    @GetMapping("/packs")
    public ResponseEntity<Map<String, Integer>> getAvailablePacks() {
        return ResponseEntity.ok(wordPackService.getAvailablePacks());
    }

    @PostMapping("/packs/generate-ai")
    public ResponseEntity<List<WordPair>> generateAiPack(@RequestBody AiPackRequest request) {
        List<WordPair> pairs = geminiCineSpyService.generateCustomWordPairs(request.getThemePrompt());
        wordPackService.addCustomPairs("CUSTOM_AI", pairs);
        return ResponseEntity.ok(pairs);
    }

    @PostMapping("/packs/custom-vs")
    public ResponseEntity<List<WordPair>> addCustomVsPairs(@RequestBody CustomVsRequest request) {
        return ResponseEntity.ok(wordPackService.addVsPairs(request));
    }

    @GetMapping("/packs/custom-vs")
    public ResponseEntity<List<CustomWordPairEntity>> getCustomVsPairs() {
        return ResponseEntity.ok(wordPackService.getAllCustomVsEntities());
    }

    @DeleteMapping("/packs/custom-vs/{id}")
    public ResponseEntity<Map<String, String>> deleteCustomVsPair(@PathVariable Long id) {
        wordPackService.deleteCustomVsPair(id);
        return ResponseEntity.ok(Map.of("status", "deleted", "id", id.toString()));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<PlayerProfileEntity>> getLeaderboard() {
        return ResponseEntity.ok(cineSpyRoomService.getLeaderboard());
    }

    @GetMapping("/network-info")
    public ResponseEntity<Map<String, String>> getNetworkInfo() {
        String ip = "localhost";
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
            while (interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();
                if (iface.isLoopback() || !iface.isUp()) continue;
                Enumeration<InetAddress> addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress addr = addresses.nextElement();
                    if (addr instanceof Inet4Address && !addr.isLoopbackAddress()) {
                        String candidate = addr.getHostAddress();
                        if (candidate.startsWith("192.") || candidate.startsWith("10.") || candidate.startsWith("172.")) {
                            ip = candidate;
                            break;
                        }
                    }
                }
                if (!"localhost".equals(ip)) break;
            }
        } catch (Exception ignored) {}
        return ResponseEntity.ok(Map.of("lanIp", ip));
    }
}
