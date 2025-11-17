package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
    private String tipoDocumento; // Para paciente
    private String numeroDocumento; // Para paciente
    private String cmp; // Para médico
}