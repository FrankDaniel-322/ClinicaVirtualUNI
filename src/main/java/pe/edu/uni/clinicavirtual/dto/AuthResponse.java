package pe.edu.uni.clinicavirtual.dto;

import lombok.Data;
import pe.edu.uni.clinicavirtual.entity.Usuario;

@Data
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String email;
    private Usuario.Rol rol;
    private String nombreCompleto;

    public AuthResponse(String token, Usuario usuario, String nombreCompleto) {
        this.token = token;
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.rol = usuario.getRol();
        this.nombreCompleto = nombreCompleto;
    }
}