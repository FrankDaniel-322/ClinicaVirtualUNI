package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteDTO {
    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String celular;
    private String email;
    private String departamento;
    private String provincia;
    private String distrito;
    private String direccion;
    private String tipoSangre;
    private String alergias;
    private String enfermedadesCronicas;
    private String medicamentosActuales;
    private String antecedentes;
}