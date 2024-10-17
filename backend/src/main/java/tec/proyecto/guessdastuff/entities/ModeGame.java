package tec.proyecto.guessdastuff.entities;

import java.util.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "mode_game")
public class ModeGame {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column
    private String name;

    @Column
    private String urlIcon;

    @Column
    private String description;

    @Column
    private String childrenName;

    @Column
    private String hint1;

    @Column
    private String hint2;

    @Column
    private String hint3;

    @ManyToMany
    @JoinTable(
        name = "mode_game_category", // Nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "mode_game_id"), // Clave foránea de ModeGame
        inverseJoinColumns = @JoinColumn(name = "category_id") // Clave foránea de Category
    )
    private List<Category> categories = new ArrayList<>();

}
