package ec.edu.espe.usuarios.services.impl;

import ec.edu.espe.usuarios.dto.request.UserCreateRequest;
import ec.edu.espe.usuarios.dto.response.PersonResponse;
import ec.edu.espe.usuarios.dto.response.UserResponse;
import ec.edu.espe.usuarios.models.*;
import ec.edu.espe.usuarios.repositories.PersonRepository;
import ec.edu.espe.usuarios.repositories.RoleRepository;
import ec.edu.espe.usuarios.repositories.UserRepository;
import ec.edu.espe.usuarios.repositories.UserRoleRepository;
import ec.edu.espe.usuarios.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;



    @Override
    @Transactional // Asegura que si falla la creación del usuario, se revierta la creación de la persona (Rollback)
    public UserResponse createUser(UserCreateRequest userRequest) {
        //Validacion de unicidad
        if (personRepository.existsByEmail(userRequest.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado");
        }
        if (personRepository.existsByDni(userRequest.getDni())) {
            throw new IllegalArgumentException("El DNI ya esta registrado");
        }

        Person person = Person.builder()
                .dni(userRequest.getDni())
                .middleName(userRequest.getMiddleName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .phone(userRequest.getPhone())
                .address(userRequest.getAddress())
                .nationality(userRequest.getNationality())
                .firtsName(userRequest.getFirstName())
                .build();

        person = personRepository.save(person);
        //DEBER, capturar el id de la persona
        UUID personId = person.getId();

        //generar el username
        User user = User.builder()
                //.id(person.getId())
                .person(person)
                .username(generarUsername(userRequest.getFirstName(), userRequest.getMiddleName(), userRequest.getLastName()))
//                .passwordHash(userRequest.getDni())
                .passwordHash(passwordEncoder.encode(userRequest.getDni()))
                .build();
        user = userRepository.save(user);

        return mapToUserResponse(user);
    }


    @Override
    @Transactional(readOnly = true) // Optimiza la consulta en base de datos ya que no vamos a modificar nada
    public List<UserResponse> getUsers() {
        //stream
        return userRepository.findAll().stream()
                //.map(user ->mapToUserResponse(user))
                .map(this::mapToUserResponse) //es lo mismo de lo anterior pero con el this.
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return mapToUserResponse(user);
    }

    //para asignar el rol a un usuario y funcione, hacemos esto
    @Override
    @Transactional
    public UserResponse assigneRole(UUID userId, UUID roleId) {

        // 1. Buscamos el usuario y el rol
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        // 2. Buscamos si la relación ya existe para evitar duplicados en memoria de Hibernate
        Optional<UserRole> existingUserRole = user.getUserRoles().stream()
                .filter(ur -> ur.getRole().getId().equals(roleId))
                .findFirst();

        if (existingUserRole.isPresent()) {
            UserRole userRole = existingUserRole.get();
            if (userRole.getActive()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El rol ya está activo para este usuario");
            }
            userRole.setActive(true); // Reactivamos si estaba inactivo
        } else {
            // 3. Creamos la relación nueva si no existía ningún rastro de ella
            UserRoleId userRoleId = new UserRoleId(userId, roleId);

            UserRole newUserRole = UserRole.builder()
                    .id(userRoleId)
                    .user(user)
                    .role(role)
                    .active(true)
                    .build();

            user.getUserRoles().add(newUserRole);
        }

        // 4. Al guardar el usuario, JPA detecta el cambio en la lista y guarda en 'user_role'
        userRepository.save(user);

        return mapToUserResponse(user);
    }


    private UserResponse mapToUserResponse(User user) {
        List<String> roles = user.getUserRoles().stream()
                .filter(UserRole::getActive)
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        Person person = user.getPerson();
        PersonResponse personResponse = PersonResponse.builder()
                .id(person.getId())
                .dni(person.getDni())
                .firstName(person.getFirtsName())
                .middleName(person.getMiddleName())
                .lastName(person.getLastName())
                .email(person.getEmail())
                .phone(person.getPhone())
                .address(person.getAddress())
                .nationality(person.getNationality())
                .active(person.getActive())
                .build();
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .active(user.getActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .person(personResponse)
                .roles(roles)
                .build();
    }

    private String generarUsername(String fn, String mn, String ln) {
        // 1. Separar los apellidos por espacio (con un espacio en medio)
        String[] partes = ln.split(" ");

        // 2. Iniciar con "" evita que Java sume matemáticamente los caracteres
        String username = "" + fn.charAt(0) + mn.charAt(0) + partes[0];

        // 3. Agregar la primera letra del segundo apellido (si existe)
        if (partes.length > 1 && !partes[1].isEmpty()) {
            username += partes[1].charAt(0);
        }

        // 4. Validar si ya existe en la base de datos
        if (userRepository.findByUsername(username.toLowerCase()).size() > 0) {
            username += userRepository.findByUsername(username.toLowerCase()).size() + 1;
        }

        return username.toLowerCase();
    }
}




