package ec.edu.espe.usuarios.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String username;
    private boolean active;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private PersonResponse person; // <-- FALTABA ESTO
    private List<String> roles;

}
