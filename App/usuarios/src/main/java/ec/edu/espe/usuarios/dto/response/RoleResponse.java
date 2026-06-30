package ec.edu.espe.usuarios.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RoleResponse {
    private UUID id;
    private String name;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;

    // Aquí es donde mostraremos los usernames de los usuarios que tienen este rol
    private List<String> usernames;
}