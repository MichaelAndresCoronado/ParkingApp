package ec.edu.espe.usuarios.services;

import ec.edu.espe.usuarios.dto.request.RoleCreateRequest;
import ec.edu.espe.usuarios.dto.request.RoleUpdateRequest;
import ec.edu.espe.usuarios.dto.response.RoleResponse;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    RoleResponse createRole(RoleCreateRequest request);
    List<RoleResponse> getAllRoles();

    // Nuevos métodos para completar el CRUD
    RoleResponse getRoleById(UUID id);
    RoleResponse updateRole(UUID id, RoleUpdateRequest request);
    void deleteRole(UUID id); // Eliminación lógica (soft delete)
}