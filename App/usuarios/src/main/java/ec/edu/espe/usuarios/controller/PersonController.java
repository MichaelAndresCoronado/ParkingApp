package ec.edu.espe.usuarios.controller;

import ec.edu.espe.usuarios.dto.response.PersonResponse;
import ec.edu.espe.usuarios.models.Person;
import ec.edu.espe.usuarios.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/personas")
@RequiredArgsConstructor
public class PersonController {

    private final PersonRepository personRepository;

    @GetMapping("/{dni}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OPERADOR')")
    public ResponseEntity<PersonResponse> getPersonByDni(@PathVariable String dni) {
        Person person = personRepository.findByDni(dni)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona no encontrada"));

        PersonResponse response = PersonResponse.builder()
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

        return ResponseEntity.ok(response);
    }
}