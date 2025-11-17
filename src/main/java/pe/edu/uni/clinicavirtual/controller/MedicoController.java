package pe.edu.uni.clinicavirtual.controller;

import pe.edu.uni.clinicavirtual.dto.ConsultaDTO;
import pe.edu.uni.clinicavirtual.dto.MedicoDTO;
import pe.edu.uni.clinicavirtual.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    // Obtener perfil del médico
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            MedicoDTO perfil = medicoService.obtenerPerfil(userDetails.getUsername());
            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Obtener historial de consultas respondidas
    @GetMapping("/historial")
    public ResponseEntity<?> obtenerHistorial(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<ConsultaDTO> historial = medicoService.obtenerHistorialConsultas(userDetails.getUsername());
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Obtener estadísticas del médico
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            Map<String, Object> estadisticas = medicoService.obtenerEstadisticas(userDetails.getUsername());
            return ResponseEntity.ok(estadisticas);
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