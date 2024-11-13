package tec.proyecto.guessdastuff.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(unique = true, name = "username")
    private String username;

    @Column(unique= true, name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "urlPerfil")
    private String urlPerfil;

    @Column(name = "country")
    private String country;

    @Column(name = "birthday")
    private LocalDate birthday;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private ERole role;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EStatus status;

    @Column(name = "atCreate", updatable = false)
    private LocalDateTime atCreate;

    @Column(name = "atUpdate")
    private LocalDateTime atUpdate;
    
    @Column(name = "resetToken")
    private String resetToken;

    @PrePersist
    protected void onCreate() {
        atCreate = LocalDateTime.now();
        atUpdate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        atUpdate = LocalDateTime.now();
    }

    // UserDetails overrides

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority((role.name())));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}