package ec.edu.espe.usuarios.controller;

import ec.edu.espe.usuarios.dto.request.LoginRequest;
import ec.edu.espe.usuarios.dto.response.AuthResponse;
import ec.edu.espe.usuarios.models.UserRole;
import ec.edu.espe.usuarios.repositories.UserRepository;
import ec.edu.espe.usuarios.security.CustomUserDetails;
import ec.edu.espe.usuarios.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Autentica las credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // Si pasa, buscamos el usuario para armar sus roles en el JWT
        var user = userRepository.findByUsername(request.getUsername()).get(0);
        var userDetails = new CustomUserDetails(user);

        List<String> roles = user.getUserRoles().stream()
                .filter(UserRole::getActive)
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        // Puedes mandar los roles en el payload del JWT para que otros microservicios lo lean
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", roles);
        extraClaims.put("userId", user.getId());

        var jwtToken = jwtService.generateToken(userDetails, extraClaims);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .build());
    }
}