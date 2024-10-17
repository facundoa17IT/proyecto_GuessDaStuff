package tec.proyecto.guessdastuff.entities;

import java.util.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "category")
public class Category {
    
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

    @ManyToMany(mappedBy = "categories") // La relación inversa
    private List<ModeGame> modeGames = new ArrayList<>();

}
