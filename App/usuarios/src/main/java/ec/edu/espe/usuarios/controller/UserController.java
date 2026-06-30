package ec.edu.espe.usuarios.controller;

import ec.edu.espe.usuarios.dto.request.UserCreateRequest;
import ec.edu.espe.usuarios.dto.response.UserResponse;
import ec.edu.espe.usuarios.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN_MODIFICADO') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request){
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //formato uuid: 8-4-4-4-12
    //localhost:8080/api/users/{userId}/roles/{roleId}
    //localhost:8080/api/users8be4df61-93ca-11d2-aa0d-00e098032b8c/roles
    // Requiere token Y rol específico
    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> assigneRoleUser(@PathVariable UUID userId, @PathVariable UUID roleId){
        return ResponseEntity.ok(userService.assigneRole(userId, roleId));
    }

}
