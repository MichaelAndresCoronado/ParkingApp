package ec.edu.espe.usuarios.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RoleUpdateRequest {

    @Pattern(
            regexp = "^[A-Z_]+$",
            message = "El rol solo puede contener letras MAYÚSCULAS y guiones bajos (sin minúsculas, sin espacios, sin números)"
    )
    private String name;

    private String description;

    private Boolean active;
}