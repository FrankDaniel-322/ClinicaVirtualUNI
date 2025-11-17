package pe.edu.uni.clinicavirtual.service;

import pe.edu.uni.clinicavirtual.dto.PacienteDTO;
import pe.edu.uni.clinicavirtual.entity.Paciente;
import pe.edu.uni.clinicavirtual.entity.Usuario;
import pe.edu.uni.clinicavirtual.repository.PacienteRepository;
import pe.edu.uni.clinicavirtual.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener perfil del paciente
    public PacienteDTO obtenerPerfil(String email) {
        Paciente paciente = pacienteRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        return convertirADTO(paciente);
    }

    // Actualizar perfil del paciente
    @Transactional
    public PacienteDTO actualizarPerfil(PacienteDTO pacienteDTO, String email) {
        Paciente paciente = pacienteRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Actualizar datos básicos del paciente
        paciente.setNombres(pacienteDTO.getNombres());
        paciente.setApellidoPaterno(pacienteDTO.getApellidoPaterno());
        paciente.setApellidoMaterno(pacienteDTO.getApellidoMaterno());
        paciente.setFechaNacimiento(pacienteDTO.getFechaNacimiento());
        paciente.setSexo(pacienteDTO.getSexo());
        paciente.setCelular(pacienteDTO.getCelular());
        paciente.setDepartamento(pacienteDTO.getDepartamento());
        paciente.setProvincia(pacienteDTO.getProvincia());
        paciente.setDistrito(pacienteDTO.getDistrito());
        paciente.setDireccion(pacienteDTO.getDireccion());

        // Actualizar información médica
        paciente.setTipoSangre(pacienteDTO.getTipoSangre());
        paciente.setAlergias(pacienteDTO.getAlergias());
        paciente.setEnfermedadesCronicas(pacienteDTO.getEnfermedadesCronicas());
        paciente.setMedicamentosActuales(pacienteDTO.getMedicamentosActuales());
        paciente.setAntecedentes(pacienteDTO.getAntecedentes());

        paciente = pacienteRepository.save(paciente);

        return convertirADTO(paciente);
    }

    // Cambiar contraseña
    @Transactional
    public void cambiarPassword(String email, String currentPassword, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
    }

    private PacienteDTO convertirADTO(Paciente paciente) {
        PacienteDTO dto = new PacienteDTO();
        dto.setId(paciente.getId());
        dto.setTipoDocumento(paciente.getTipoDocumento());
        dto.setNumeroDocumento(paciente.getNumeroDocumento());
        dto.setNombres(paciente.getNombres());
        dto.setApellidoPaterno(paciente.getApellidoPaterno());
        dto.setApellidoMaterno(paciente.getApellidoMaterno());
        dto.setFechaNacimiento(paciente.getFechaNacimiento());
        dto.setSexo(paciente.getSexo());
        dto.setCelular(paciente.getCelular());
        dto.setEmail(paciente.getUsuario().getEmail());
        dto.setDepartamento(paciente.getDepartamento());
        dto.setProvincia(paciente.getProvincia());
        dto.setDistrito(paciente.getDistrito());
        dto.setDireccion(paciente.getDireccion());
        dto.setTipoSangre(paciente.getTipoSangre());
        dto.setAlergias(paciente.getAlergias());
        dto.setEnfermedadesCronicas(paciente.getEnfermedadesCronicas());
        dto.setMedicamentosActuales(paciente.getMedicamentosActuales());
        dto.setAntecedentes(paciente.getAntecedentes());
        
        return dto;
    }
}