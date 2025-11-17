package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;
import pe.edu.uni.clinicavirtual.entity.Consulta;

import java.util.List;

@Data
public class ConsultaRequest {
    private Long especialidadId;
    private String motivoConsulta;
    private String antecedentes;
    private List<String> sintomas;
    private Consulta.Urgencia urgencia = Consulta.Urgencia.NORMAL;
}
