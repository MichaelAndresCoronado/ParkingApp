package ec.edu.espe.usuarios.security;

import ec.edu.espe.usuarios.models.User;
import ec.edu.espe.usuarios.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service                    // ← Spring lo registra como bean automáticamente
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository
                .findByUsername(username)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuario no encontrado: " + username));
        return new CustomUserDetails(user);
    }
}