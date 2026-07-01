package ec.edu.espe.usuarios.services.impl;

import ec.edu.espe.usuarios.dto.request.RoleCreateRequest;
import ec.edu.espe.usuarios.dto.request.RoleUpdateRequest;
import ec.edu.espe.usuarios.dto.response.RoleResponse;
import ec.edu.espe.usuarios.models.Role;
import ec.edu.espe.usuarios.models.UserRole;
import ec.edu.espe.usuarios.repositories.RoleRepository;
import ec.edu.espe.usuarios.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleCreateRequest request) {
        String roleName = request.getName().trim();

        if (roleRepository.existsByName(roleName)) {
            throw new IllegalArgumentException("El rol ya existe en el sistema");
        }

        Role role = Role.builder()
                .name(roleName)
                .description(request.getDescription())
                .build();

        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- NUEVOS MÉTODOS CRUD ---

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        return mapToResponse(role);
    }

    @Override
    public RoleResponse updateRole(UUID id, RoleUpdateRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        // Si se envía un nombre y es diferente al actual, verificamos que no exista para evitar duplicados
        if (request.getName() != null && !request.getName().isBlank()) {
            String newName = request.getName().trim();
            if (!role.getName().equals(newName) && roleRepository.existsByName(newName)) {
                throw new IllegalArgumentException("El nombre del rol ya está en uso por otro rol");
            }
            role.setName(newName);
        }

        if (request.getDescription() != null) {
            role.setDescription(request.getDescription());
        }

        if (request.getActive() != null) {
            role.setActive(request.getActive());
        }

        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Override
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        // Eliminación lógica (Soft Delete) recomendada en lugar de borrar el registro físico
        role.setActive(false);
        roleRepository.save(role);
    }

    // Método privado para mapear
    private RoleResponse mapToResponse(Role role) {
        List<String> usernamesAsignados = role.getUserRoles().stream()
                .filter(UserRole::getActive)
                .map(ur -> ur.getUser().getUsername())
                .collect(Collectors.toList());

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .active(role.getActive())
                .createdAt(role.getCreatedAt())
                .usernames(usernamesAsignados)
                .build();
    }
}