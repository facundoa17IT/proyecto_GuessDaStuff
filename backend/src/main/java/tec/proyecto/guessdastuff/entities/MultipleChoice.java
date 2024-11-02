package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "games")
public class MultipleChoice extends Game {

    @Column
    private String randomWord1;

    @Column
    private String randomWord2;

    @Column
    private String randomWord3; 

    @Column
    private String randomCorrectWord;

    @Column
    private String question;

    public MultipleChoice(Long id, GameMode idGameMode, Category idCategory, String randomWord3, String randomCorrectWord, String randomWord2, String randomWord1, String question, String hint1, String hint2, String hint3) {
        super(id, idGameMode, idCategory, hint1, hint2, hint3); // Llama al constructor de la clase padre
        this.randomCorrectWord = randomCorrectWord;
        this.randomWord1 = randomWord1;
        this.randomWord2 = randomWord2;
        this.randomWord3 = randomWord3;
        this.question = question;
    }

    public String getRandomWord1() {
        return randomWord1;
    }

    public void setRandomWord1(String randomWord1) {
        this.randomWord1 = randomWord1;
    }

    public String getRandomWord2() {
        return randomWord2;
    }

    public void setRandomWord2(String randomWord2) {
        this.randomWord2 = randomWord2;
    }

    public String getRandomWord3() {
        return randomWord3;
    }

    public void setRandomWord3(String randomWord3) {
        this.randomWord3 = randomWord3;
    }

    public String getRandomCorrectWord() {
        return randomCorrectWord;
    }

    public void setRandomCorrectWord(String randomCorrectWord) {
        this.randomCorrectWord = randomCorrectWord;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((randomWord1 == null) ? 0 : randomWord1.hashCode());
        result = prime * result + ((randomWord2 == null) ? 0 : randomWord2.hashCode());
        result = prime * result + ((randomWord3 == null) ? 0 : randomWord3.hashCode());
        result = prime * result + ((randomCorrectWord == null) ? 0 : randomCorrectWord.hashCode());
        result = prime * result + ((question == null) ? 0 : question.hashCode());
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
        MultipleChoice other = (MultipleChoice) obj;
        if (randomWord1 == null) {
            if (other.randomWord1 != null)
                return false;
        } else if (!randomWord1.equals(other.randomWord1))
            return false;
        if (randomWord2 == null) {
            if (other.randomWord2 != null)
                return false;
        } else if (!randomWord2.equals(other.randomWord2))
            return false;
        if (randomWord3 == null) {
            if (other.randomWord3 != null)
                return false;
        } else if (!randomWord3.equals(other.randomWord3))
            return false;
        if (randomCorrectWord == null) {
            if (other.randomCorrectWord != null)
                return false;
        } else if (!randomCorrectWord.equals(other.randomCorrectWord))
            return false;
        if (question == null) {
            if (other.question != null)
                return false;
        } else if (!question.equals(other.question))
            return false;
        return true;
    }


}