package ec.edu.espe.usuarios.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Data
public class User {

    @Id
    @Column(name = "id_person",  unique = true)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_person", referencedColumnName = "id")
    @MapsId
    private Person person;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Builder.Default
    private Set<UserRole> userRoles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "update_at")
    private LocalDateTime update_at;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now();
    }

}
