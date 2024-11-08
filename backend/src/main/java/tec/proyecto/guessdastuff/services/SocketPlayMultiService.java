package tec.proyecto.guessdastuff.services;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.entitiesSocket.GameAnswer;
import tec.proyecto.guessdastuff.entitiesSocket.SocketMatch;
import tec.proyecto.guessdastuff.entitiesSocket.SocketMatch.PlayerOnline;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@Service
public class SocketPlayMultiService {
    private final ConcurrentHashMap<String, SocketMatch> games = new ConcurrentHashMap<>();


    public SocketMatch createGame(String gameId, String userId, String username) {
        SocketMatch game = new SocketMatch();
        PlayerOnline player = new PlayerOnline(userId,username);
        game.setIdGame(gameId);
        game.setUserHost(player);
        games.put(game.getIdGame(), game);
        return game;
    }

    public Optional<SocketMatch> getGame(String gameId) {
        return Optional.ofNullable(games.get(gameId));
    }

    public SocketMatch addPlayerToGame(String gameId, PlayerOnline player) {
        SocketMatch game = games.get(gameId);
        if (game != null && game.getUserGuest() == null) {
            game.setUserGuest(player);
        }
        return game;
    }

    public boolean validateAnswer(GameAnswer answer) {
        // Mock validation - replace with actual game logic
        return answer.getAnswer().equalsIgnoreCase("correct_answer");
    }

    private String generateGameId() {
        return "game-" + Math.random() * 10000;
    }
}
