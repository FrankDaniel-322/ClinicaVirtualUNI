package pe.edu.uni.clinicavirtual.controller;

import pe.edu.uni.clinicavirtual.dto.PacienteDTO;
import pe.edu.uni.clinicavirtual.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // Obtener perfil del paciente
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            PacienteDTO perfil = pacienteService.obtenerPerfil(userDetails.getUsername());
            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Actualizar perfil del paciente
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody PacienteDTO pacienteDTO,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            PacienteDTO perfilActualizado = pacienteService.actualizarPerfil(pacienteDTO, userDetails.getUsername());
            return ResponseEntity.ok(perfilActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Cambiar contraseña
    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> request,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            pacienteService.cambiarPassword(userDetails.getUsername(), currentPassword, newPassword);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Contraseña actualizada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
}