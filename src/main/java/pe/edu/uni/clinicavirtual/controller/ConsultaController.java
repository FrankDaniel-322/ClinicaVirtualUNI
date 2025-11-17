package pe.edu.uni.clinicavirtual.controller;

import pe.edu.uni.clinicavirtual.dto.ConsultaDTO;
import pe.edu.uni.clinicavirtual.dto.ConsultaRequest;
import pe.edu.uni.clinicavirtual.dto.RespuestaMedicaDTO;
import pe.edu.uni.clinicavirtual.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    // Crear nueva consulta (Paciente)
    @PostMapping
    public ResponseEntity<?> crearConsulta(@RequestBody ConsultaRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ConsultaDTO consulta = consultaService.crearConsulta(request, userDetails.getUsername());
            return ResponseEntity.ok(consulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Obtener consultas del paciente (Paciente)
    @GetMapping("/paciente")
    public ResponseEntity<?> obtenerConsultasPaciente(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<ConsultaDTO> consultas = consultaService.obtenerConsultasPorPaciente(userDetails.getUsername());
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Obtener consultas pendientes (Médico)
    @GetMapping("/medico/pendientes")
    public ResponseEntity<?> obtenerConsultasPendientes(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<ConsultaDTO> consultas = consultaService.obtenerConsultasPendientesPorMedico(userDetails.getUsername());
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Obtener consulta por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerConsulta(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ConsultaDTO consulta = consultaService.obtenerConsultaPorId(id, userDetails.getUsername());
            return ResponseEntity.ok(consulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Responder consulta (Médico)
    @PostMapping("/{id}/responder")
    public ResponseEntity<?> responderConsulta(@PathVariable Long id,
                                             @RequestBody RespuestaMedicaDTO respuestaDTO,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        try {
            ConsultaDTO consulta = consultaService.responderConsulta(id, respuestaDTO, userDetails.getUsername());
            return ResponseEntity.ok(consulta);
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