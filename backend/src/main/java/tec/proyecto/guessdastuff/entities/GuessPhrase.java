package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((phrase == null) ? 0 : phrase.hashCode());
        result = prime * result + ((correctWord == null) ? 0 : correctWord.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        GuessPhrase other = (GuessPhrase) obj;
        if (phrase == null) {
            if (other.phrase != null)
                return false;
        } else if (!phrase.equals(other.phrase))
            return false;
        if (correctWord == null) {
            if (other.correctWord != null)
                return false;
        } else if (!correctWord.equals(other.correctWord))
            return false;
        return true;
    }

    
}
