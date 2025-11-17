package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;

@Data
public class MedicoDTO {
    private Long id;
    private String cmp;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String especialidad;
    private String email;
    private Boolean activo;
}