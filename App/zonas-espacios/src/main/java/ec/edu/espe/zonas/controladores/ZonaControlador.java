package ec.edu.espe.zonas.controladores;

import ec.edu.espe.zonas.dto.ZonaRequestDTO;
import ec.edu.espe.zonas.response.ZonaResponseDto;
import ec.edu.espe.zonas.servicios.interfaz.ZonaServicio;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/zonas")
@RequiredArgsConstructor
public class ZonaControlador {

    private final ZonaServicio servicioZonas;

    // LISTAR TODAS LAS ZONAS
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OPERADOR', 'CLIENTE')")
    public ResponseEntity<List<ZonaResponseDto>> listarZonas() {
        return ResponseEntity.ok(servicioZonas.listarZonas());
    }

    // CREAR ZONA
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ZonaResponseDto> crearZona(@Valid @RequestBody ZonaRequestDTO dto) {
        ZonaResponseDto responseDto = servicioZonas.crear(dto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // ACTUALIZAR ZONA
    @PutMapping("/{idZona}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ZonaResponseDto> actualizarZona(
            @PathVariable UUID idZona,
            @Valid @RequestBody ZonaRequestDTO dto) {
        return ResponseEntity.ok(servicioZonas.actualizar(idZona, dto));
    }

    // ELIMINAR ZONA
    @DeleteMapping("/{idZona}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> eliminarZona(@PathVariable UUID idZona) {
        servicioZonas.eliminarZona(idZona);
        return ResponseEntity.noContent().build();
    }
}
