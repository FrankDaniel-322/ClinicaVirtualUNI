package pe.edu.uni.clinicavirtual.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteDTO {
    private Long id;
    
    @NotBlank(message = "El tipo de documento es obligatorio")
    private String tipoDocumento;
    
    @NotBlank(message = "El número de documento es obligatorio")
    @Size(min = 8, max = 15, message = "El documento debe tener entre 8 y 15 caracteres")
    private String numeroDocumento;
    
    @NotBlank(message = "Los nombres son obligatorios")
    @Pattern(regexp = "^[a-zA-ZáéíóúñÁÉÍÓÚÑ\\s]+$", message = "Los nombres solo deben contener letras")
    private String nombres;
    
    @NotBlank(message = "El apellido paterno es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúñÁÉÍÓÚÑ\\s]+$", message = "El apellido paterno solo debe contener letras")
    private String apellidoPaterno;
    
    @NotBlank(message = "El apellido materno es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúñÁÉÍÓÚÑ\\s]+$", message = "El apellido materno solo debe contener letras")
    private String apellidoMaterno;
    
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;
    
    @NotBlank(message = "El sexo es obligatorio")
    @Pattern(regexp = "^[MF]$", message = "El sexo debe ser M o F")
    private String sexo;
    
    @NotBlank(message = "El celular es obligatorio")
    @Pattern(regexp = "^9\\d{8}$", message = "El celular debe tener 9 dígitos y comenzar con 9")
    private String celular;
    
    @Email(message = "El formato del email no es válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;
    
    @NotBlank(message = "El departamento es obligatorio")
    private String departamento;
    
    @NotBlank(message = "La provincia es obligatoria")
    private String provincia;
    
    @NotBlank(message = "El distrito es obligatorio")
    private String distrito;
    
    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 10, message = "La dirección debe tener al menos 10 caracteres")
    private String direccion;
    
    private String tipoSangre;
    private String alergias;
    private String enfermedadesCronicas;
    private String medicamentosActuales;
    private String antecedentes;
}