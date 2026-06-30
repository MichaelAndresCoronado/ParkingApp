package ec.edu.espe.usuarios.repositories;

import ec.edu.espe.usuarios.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {

    Boolean existsByEmail(String email);
    Boolean existsByDni(String dni);

    // AGREGA ESTA LÍNEA
    Optional<Person> findByDni(String dni);

}