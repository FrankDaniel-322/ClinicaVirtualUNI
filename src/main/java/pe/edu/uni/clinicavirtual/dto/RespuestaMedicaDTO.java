package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RespuestaMedicaDTO {
    private Long id;
    private Long consultaId;
    private Long medicoId;
    private String medicoNombre;
    private String diagnostico;
    private String recomendaciones;
    private String medicamentosRecetados;
    private String proximoControl;
    private Boolean archivoReceta;
    private LocalDateTime fechaRespuesta;
}