package ec.edu.espe.usuarios.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "persons")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Data
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false, length = 25)
    private String dni;

    @Column(nullable = false, length = 25)
    private String firtsName;

    @Column(name = "middle_name", length = 25)
    private String middleName;

    @Column(nullable = false, length = 25)
    private String lastName;

    @Column(nullable = false, length = 25, unique = true)
    private String email;

    @Column(nullable = false, length = 15, unique = true)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 25)
    private String nationality;

    @Builder.Default
    private Boolean active = true;


    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "update_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}
