package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class GuessPhrase extends Game {

    @Column
    private String phrase;

    @Column
    private String correctWord;

    public GuessPhrase(Long id, GameMode idGameMode, Category idCategory, String phrase, String correctWord, String hint1, String hint2, String hint3) {
        super(id, idGameMode, idCategory, hint1, hint2, hint3); // Llama al constructor de la clase padre
        this.phrase = phrase;
        this.correctWord = correctWord;
    }
}
