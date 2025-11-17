package pe.edu.uni.clinicavirtual.service;

import pe.edu.uni.clinicavirtual.dto.ConsultaDTO;
import pe.edu.uni.clinicavirtual.dto.ConsultaRequest;
import pe.edu.uni.clinicavirtual.dto.RespuestaMedicaDTO;
import pe.edu.uni.clinicavirtual.entity.*;
import pe.edu.uni.clinicavirtual.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private SintomaConsultaRepository sintomaConsultaRepository;

    @Autowired
    private RespuestaMedicaRepository respuestaMedicaRepository;

    // Crear nueva consulta
    @Transactional
    public ConsultaDTO crearConsulta(ConsultaRequest request, String pacienteEmail) {
        // Obtener paciente
        Paciente paciente = pacienteRepository.findByUsuarioEmail(pacienteEmail)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Obtener especialidad
        Especialidad especialidad = especialidadRepository.findById(request.getEspecialidadId())
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        // Crear consulta
        Consulta consulta = new Consulta();
        consulta.setPaciente(paciente);
        consulta.setEspecialidad(especialidad);
        consulta.setMotivoConsulta(request.getMotivoConsulta());
        consulta.setAntecedentes(request.getAntecedentes());
        consulta.setUrgencia(request.getUrgencia());
        consulta.setEstado(Consulta.Estado.PENDIENTE);
        consulta.setFechaSolicitud(LocalDateTime.now());

        consulta = consultaRepository.save(consulta);

        // Guardar síntomas
        if (request.getSintomas() != null) {
            for (String sintoma : request.getSintomas()) {
                SintomaConsulta sintomaConsulta = new SintomaConsulta();
                sintomaConsulta.setConsulta(consulta);
                sintomaConsulta.setSintoma(sintoma);
                sintomaConsultaRepository.save(sintomaConsulta);
            }
        }

        return convertirADTO(consulta);
    }

    // Obtener consultas de un paciente
    public List<ConsultaDTO> obtenerConsultasPorPaciente(String pacienteEmail) {
        List<Consulta> consultas = consultaRepository.findByPacienteUsuarioEmailOrderByFechaSolicitudDesc(pacienteEmail);
        return consultas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener consultas pendientes para médico
    public List<ConsultaDTO> obtenerConsultasPendientesPorMedico(String medicoEmail) {
        Medico medico = medicoRepository.findByUsuarioEmail(medicoEmail)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        List<Consulta> consultas = consultaRepository.findConsultasPendientesByMedico(medico.getId());
        return consultas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener consulta por ID
    public ConsultaDTO obtenerConsultaPorId(Long id, String usuarioEmail) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));

        // Verificar permisos (paciente o médico asignado)
        if (!consulta.getPaciente().getUsuario().getEmail().equals(usuarioEmail) &&
            (consulta.getMedico() == null || !consulta.getMedico().getUsuario().getEmail().equals(usuarioEmail))) {
            throw new RuntimeException("No tiene permisos para ver esta consulta");
        }

        return convertirADTO(consulta);
    }

    // Responder consulta
    @Transactional
    public ConsultaDTO responderConsulta(Long consultaId, RespuestaMedicaDTO respuestaDTO, String medicoEmail) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));

        Medico medico = medicoRepository.findByUsuarioEmail(medicoEmail)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        // Verificar que la consulta esté pendiente
        if (consulta.getEstado() != Consulta.Estado.PENDIENTE) {
            throw new RuntimeException("La consulta ya ha sido respondida");
        }

        // Crear respuesta médica
        RespuestaMedica respuesta = new RespuestaMedica();
        respuesta.setConsulta(consulta);
        respuesta.setMedico(medico);
        respuesta.setDiagnostico(respuestaDTO.getDiagnostico());
        respuesta.setRecomendaciones(respuestaDTO.getRecomendaciones());
        respuesta.setMedicamentosRecetados(respuestaDTO.getMedicamentosRecetados());
        respuesta.setProximoControl(respuestaDTO.getProximoControl() != null ? 
            LocalDateTime.parse(respuestaDTO.getProximoControl() + "T00:00:00") : null);
        respuesta.setFechaRespuesta(LocalDateTime.now());

        respuestaMedicaRepository.save(respuesta);

        // Actualizar consulta
        consulta.setMedico(medico);
        consulta.setEstado(Consulta.Estado.COMPLETADA);
        consulta.setFechaRespuesta(LocalDateTime.now());
        consultaRepository.save(consulta);

        return convertirADTO(consulta);
    }

    // Convertir entidad a DTO
    private ConsultaDTO convertirADTO(Consulta consulta) {
        ConsultaDTO dto = new ConsultaDTO();
        dto.setId(consulta.getId());
        dto.setPacienteId(consulta.getPaciente().getId());
        dto.setPacienteNombre(consulta.getPaciente().getNombres() + " " + 
                             consulta.getPaciente().getApellidoPaterno() + " " + 
                             consulta.getPaciente().getApellidoMaterno());
        
        if (consulta.getMedico() != null) {
            dto.setMedicoId(consulta.getMedico().getId());
            dto.setMedicoNombre("Dr. " + consulta.getMedico().getNombres() + " " + 
                               consulta.getMedico().getApellidoPaterno());
        }
        
        dto.setEspecialidadId(consulta.getEspecialidad().getId());
        dto.setEspecialidadNombre(consulta.getEspecialidad().getNombre());
        dto.setMotivoConsulta(consulta.getMotivoConsulta());
        dto.setAntecedentes(consulta.getAntecedentes());
        dto.setEstado(consulta.getEstado());
        dto.setUrgencia(consulta.getUrgencia());
        dto.setFechaSolicitud(consulta.getFechaSolicitud());
        dto.setFechaRespuesta(consulta.getFechaRespuesta());
        
        // Síntomas
        List<String> sintomas = consulta.getSintomas().stream()
                .map(SintomaConsulta::getSintoma)
                .collect(Collectors.toList());
        dto.setSintomas(sintomas);
        
        // Respuesta médica
        if (consulta.getRespuestaMedica() != null) {
            RespuestaMedicaDTO respuestaDTO = new RespuestaMedicaDTO();
            respuestaDTO.setId(consulta.getRespuestaMedica().getId());
            respuestaDTO.setConsultaId(consulta.getId());
            respuestaDTO.setMedicoId(consulta.getMedico().getId());
            respuestaDTO.setMedicoNombre("Dr. " + consulta.getMedico().getNombres() + " " + 
                                       consulta.getMedico().getApellidoPaterno());
            respuestaDTO.setDiagnostico(consulta.getRespuestaMedica().getDiagnostico());
            respuestaDTO.setRecomendaciones(consulta.getRespuestaMedica().getRecomendaciones());
            respuestaDTO.setMedicamentosRecetados(consulta.getRespuestaMedica().getMedicamentosRecetados());
            respuestaDTO.setProximoControl(consulta.getRespuestaMedica().getProximoControl() != null ? 
                consulta.getRespuestaMedica().getProximoControl().toLocalDate().toString() : null);
            respuestaDTO.setFechaRespuesta(consulta.getRespuestaMedica().getFechaRespuesta());
            
            dto.setRespuestaMedica(respuestaDTO);
        }
        
        return dto;
    }
}