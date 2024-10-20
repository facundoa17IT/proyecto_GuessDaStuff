package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class OrderWord extends Game {

    @Column
    private String word;

    public OrderWord(Long id, GameMode idGameMode, Category idCategory, String word, String hint1, String hint2, String hint3) {
        super(id, idGameMode, idCategory, hint1, hint2, hint3); // Llama al constructor de la clase padre
        this.word = word;
    }
}
