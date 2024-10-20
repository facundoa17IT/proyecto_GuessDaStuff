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
}
