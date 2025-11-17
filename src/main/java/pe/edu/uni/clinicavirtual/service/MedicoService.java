package pe.edu.uni.clinicavirtual.service;

import pe.edu.uni.clinicavirtual.dto.ConsultaDTO;
import pe.edu.uni.clinicavirtual.dto.MedicoDTO;
import pe.edu.uni.clinicavirtual.entity.Medico;
import pe.edu.uni.clinicavirtual.entity.Consulta;
import pe.edu.uni.clinicavirtual.repository.MedicoRepository;
import pe.edu.uni.clinicavirtual.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    // Obtener perfil del médico
    public MedicoDTO obtenerPerfil(String email) {
        Medico medico = medicoRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        return convertirADTO(medico);
    }

    // Obtener historial de consultas respondidas
    public List<ConsultaDTO> obtenerHistorialConsultas(String email) {
        Medico medico = medicoRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        List<Consulta> consultas = consultaRepository.findByMedicoIdOrderByFechaSolicitudDesc(medico.getId());
        return consultas.stream()
                .map(this::convertirConsultaADTO)
                .collect(Collectors.toList());
    }

    // Obtener estadísticas del médico
    public Map<String, Object> obtenerEstadisticas(String email) {
        Medico medico = medicoRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        List<Consulta> consultasMedico = consultaRepository.findByMedicoIdOrderByFechaSolicitudDesc(medico.getId());
        
        long totalConsultas = consultasMedico.size();
        long consultasUrgentes = consultasMedico.stream()
                .filter(c -> c.getUrgencia() == Consulta.Urgencia.URGENTE)
                .count();
        long consultasCompletadas = consultasMedico.stream()
                .filter(c -> c.getEstado() == Consulta.Estado.COMPLETADA)
                .count();

        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("totalConsultas", totalConsultas);
        estadisticas.put("consultasUrgentes", consultasUrgentes);
        estadisticas.put("consultasCompletadas", consultasCompletadas);
        estadisticas.put("medico", convertirADTO(medico));

        return estadisticas;
    }

    private MedicoDTO convertirADTO(Medico medico) {
        MedicoDTO dto = new MedicoDTO();
        dto.setId(medico.getId());
        dto.setCmp(medico.getCmp());
        dto.setNombres(medico.getNombres());
        dto.setApellidoPaterno(medico.getApellidoPaterno());
        dto.setApellidoMaterno(medico.getApellidoMaterno());
        dto.setEspecialidad(medico.getEspecialidad());
        dto.setEmail(medico.getUsuario().getEmail());
        dto.setActivo(medico.getActivo());
        return dto;
    }

    private ConsultaDTO convertirConsultaADTO(Consulta consulta) {
        ConsultaDTO dto = new ConsultaDTO();
        dto.setId(consulta.getId());
        dto.setPacienteId(consulta.getPaciente().getId());
        dto.setPacienteNombre(consulta.getPaciente().getNombres() + " " + 
                             consulta.getPaciente().getApellidoPaterno());
        dto.setEspecialidadNombre(consulta.getEspecialidad().getNombre());
        dto.setMotivoConsulta(consulta.getMotivoConsulta());
        dto.setEstado(consulta.getEstado());
        dto.setUrgencia(consulta.getUrgencia());
        dto.setFechaSolicitud(consulta.getFechaSolicitud());
        dto.setFechaRespuesta(consulta.getFechaRespuesta());
        
        return dto;
    }
}