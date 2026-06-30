package ec.edu.espe.usuarios.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RoleCreateRequest {

    @NotBlank(message = "El nombre del rol es obligatorio")
    @Pattern(
            regexp = "^[A-Z_]+$",
            message = "El rol solo puede contener letras MAYÚSCULAS y guiones bajos (sin minúsculas, sin espacios, sin números)"
    )
    private String name;

    private String description;
}