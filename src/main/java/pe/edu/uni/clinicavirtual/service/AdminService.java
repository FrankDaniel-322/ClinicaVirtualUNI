package pe.edu.uni.clinicavirtual.service;

import pe.edu.uni.clinicavirtual.entity.Consulta;
import pe.edu.uni.clinicavirtual.repository.ConsultaRepository;
import pe.edu.uni.clinicavirtual.repository.PacienteRepository;
import pe.edu.uni.clinicavirtual.repository.MedicoRepository;
import pe.edu.uni.clinicavirtual.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    // Obtener estadísticas generales
    public Map<String, Object> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();

        // Contadores básicos
        long totalUsuarios = usuarioRepository.count();
        long totalPacientes = pacienteRepository.count();
        long totalMedicos = medicoRepository.countByActivoTrue();
        long totalConsultas = consultaRepository.count();
        long consultasPendientes = consultaRepository.countConsultasPendientes();

        estadisticas.put("totalUsuarios", totalUsuarios);
        estadisticas.put("totalPacientes", totalPacientes);
        estadisticas.put("totalMedicos", totalMedicos);
        estadisticas.put("totalConsultas", totalConsultas);
        estadisticas.put("consultasPendientes", consultasPendientes);

        // Consultas por estado
        Map<String, Long> consultasPorEstado = new HashMap<>();
        consultasPorEstado.put("PENDIENTE", consultaRepository.findByEstadoOrderByFechaSolicitudDesc(Consulta.Estado.PENDIENTE).size());
        consultasPorEstado.put("COMPLETADA", consultaRepository.findByEstadoOrderByFechaSolicitudDesc(Consulta.Estado.COMPLETADA).size());
        consultasPorEstado.put("CANCELADA", consultaRepository.findByEstadoOrderByFechaSolicitudDesc(Consulta.Estado.CANCELADA).size());
        
        estadisticas.put("consultasPorEstado", consultasPorEstado);

        // Síntomas más comunes
        List<Object[]> sintomasComunes = consultaRepository.findSintomasMasComunes();
        Map<String, Long> sintomasFrecuencia = sintomasComunes.stream()
                .collect(Collectors.toMap(
                    obj -> (String) obj[0],
                    obj -> (Long) obj[1]
                ));
        estadisticas.put("sintomasMasComunes", sintomasFrecuencia);

        // Consultas del último mes
        LocalDateTime haceUnMes = LocalDateTime.now().minusMonths(1);
        long consultasUltimoMes = consultaRepository.countByFechaSolicitudAfter(haceUnMes);
        estadisticas.put("consultasUltimoMes", consultasUltimoMes);

        return estadisticas;
    }

    // Obtener reporte detallado
    public Map<String, Object> generarReporteDetallado() {
        Map<String, Object> reporte = new HashMap<>();
        
        // Estadísticas generales
        reporte.put("estadisticas", obtenerEstadisticasGenerales());
        
        // Últimas consultas
        List<Consulta> ultimasConsultas = consultaRepository.findTop10ByOrderByFechaSolicitudDesc();
        reporte.put("ultimasConsultas", ultimasConsultas);
        
        // Médicos más activos
        List<Object[]> medicosActivos = consultaRepository.findMedicosMasActivos();
        reporte.put("medicosActivos", medicosActivos);

        return reporte;
    }
}