package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;
import pe.edu.uni.clinicavirtual.entity.Consulta;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ConsultaDTO {
    private Long id;
    private Long pacienteId;
    private String pacienteNombre;
    private Long medicoId;
    private String medicoNombre;
    private Long especialidadId;
    private String especialidadNombre;
    private String motivoConsulta;
    private String antecedentes;
    private Consulta.Estado estado;
    private Consulta.Urgencia urgencia;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private List<String> sintomas;
    private RespuestaMedicaDTO respuestaMedica;
    
    // Para creación
    private List<String> sintomasSeleccionados;
}

@Data
class ConsultaRequest {
    private Long especialidadId;
    private String motivoConsulta;
    private String antecedentes;
    private List<String> sintomas;
    private Consulta.Urgencia urgencia = Consulta.Urgencia.NORMAL;
}