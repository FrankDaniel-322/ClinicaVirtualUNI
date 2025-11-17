package pe.edu.uni.clinicavirtual.controller;

import pe.edu.uni.clinicavirtual.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Obtener estadísticas generales
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas() {
        try {
            Map<String, Object> estadisticas = adminService.obtenerEstadisticasGenerales();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Generar reporte detallado
    @GetMapping("/reportes")
    public ResponseEntity<?> generarReporte() {
        try {
            Map<String, Object> reporte = adminService.generarReporteDetallado();
            return ResponseEntity.ok(reporte);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // Exportar datos (simulado)
    @PostMapping("/exportar")
    public ResponseEntity<?> exportarDatos() {
        try {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Datos preparados para exportación. En un sistema real se generaría un archivo.");
            response.put("estado", "completado");
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