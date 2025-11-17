package pe.edu.uni.clinicavirtual.controller;

import pe.edu.uni.clinicavirtual.dto.AuthRequest;
import pe.edu.uni.clinicavirtual.dto.AuthResponse;
import pe.edu.uni.clinicavirtual.dto.PacienteDTO;
import pe.edu.uni.clinicavirtual.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login-paciente")
    public ResponseEntity<?> loginPaciente(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.loginPaciente(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login-medico")
    public ResponseEntity<?> loginMedico(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.loginMedico(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/registro-paciente")
    public ResponseEntity<?> registrarPaciente(@RequestBody PacienteDTO pacienteDTO) {
        try {
            AuthResponse response = authService.registrarPaciente(pacienteDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // En JWT, el logout es manejado en el frontend eliminando el token
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout exitoso");
        return ResponseEntity.ok(response);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
}