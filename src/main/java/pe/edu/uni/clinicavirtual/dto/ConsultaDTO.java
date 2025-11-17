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
    
    // Para creaci�n
    private List<String> sintomasSeleccionados;
}

