package ec.edu.espe.zonas.servicios;

import ec.edu.espe.zonas.entidades.Espacio;
import ec.edu.espe.zonas.entidades.EstadoEspacio;
import ec.edu.espe.zonas.repositorios.EspacioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservaScheduler {

    private final EspacioRepositorio espacioRepositorio;

    // Ejecuta esta revisión cada 60 segundos
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void liberarReservasExpiradas() {
        // Calcula la hora exacta de hace 5 minutos
        LocalDateTime limite = LocalDateTime.now().minusMinutes(5);

        List<Espacio> espaciosReservados = espacioRepositorio.findByEstado(EstadoEspacio.RESERVADO);

        for (Espacio espacio : espaciosReservados) {
            if (espacio.getFechaActualizacion().isBefore(limite)) {
                espacio.setEstado(EstadoEspacio.DISPONIBLE);
                espacio.setFechaActualizacion(LocalDateTime.now());
                espacioRepositorio.save(espacio);
                System.out.println("⚠️ Reserva expirada: El espacio " + espacio.getNombre() + " vuelve a estar DISPONIBLE.");
            }
        }
    }
}