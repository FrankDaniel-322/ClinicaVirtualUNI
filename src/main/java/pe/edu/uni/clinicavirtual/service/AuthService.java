package pe.edu.uni.clinicavirtual.service;

import pe.edu.uni.clinicavirtual.dto.AuthRequest;
import pe.edu.uni.clinicavirtual.dto.AuthResponse;
import pe.edu.uni.clinicavirtual.dto.PacienteDTO;
import pe.edu.uni.clinicavirtual.entity.Usuario;
import pe.edu.uni.clinicavirtual.entity.Paciente;
import pe.edu.uni.clinicavirtual.repository.UsuarioRepository;
import pe.edu.uni.clinicavirtual.repository.PacienteRepository;
import pe.edu.uni.clinicavirtual.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // Login para pacientes
    public AuthResponse loginPaciente(AuthRequest request) {
        // Autenticar con email y password
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Obtener usuario
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que sea paciente
        if (usuario.getRol() != Usuario.Rol.PACIENTE) {
            throw new RuntimeException("El usuario no es un paciente");
        }

        // Obtener datos del paciente
        Paciente paciente = pacienteRepository.findByUsuarioEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        String nombreCompleto = paciente.getNombres() + " " + paciente.getApellidoPaterno() + " " + paciente.getApellidoMaterno();
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, usuario, nombreCompleto);
    }

    // Registro de pacientes
    @Transactional
    public AuthResponse registrarPaciente(PacienteDTO pacienteDTO) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(pacienteDTO.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Verificar si el documento ya existe
        if (pacienteRepository.existsByNumeroDocumento(pacienteDTO.getNumeroDocumento())) {
            throw new RuntimeException("El número de documento ya está registrado");
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setEmail(pacienteDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(pacienteDTO.getNumeroDocumento())); // Password por defecto: documento
        usuario.setRol(Usuario.Rol.PACIENTE);
        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);

        // Crear paciente
        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setTipoDocumento(pacienteDTO.getTipoDocumento());
        paciente.setNumeroDocumento(pacienteDTO.getNumeroDocumento());
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
        paciente.setTipoSangre(pacienteDTO.getTipoSangre());
        paciente.setAlergias(pacienteDTO.getAlergias());
        paciente.setEnfermedadesCronicas(pacienteDTO.getEnfermedadesCronicas());
        paciente.setMedicamentosActuales(pacienteDTO.getMedicamentosActuales());
        paciente.setAntecedentes(pacienteDTO.getAntecedentes());
        
        pacienteRepository.save(paciente);

        // Generar token
        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String nombreCompleto = paciente.getNombres() + " " + paciente.getApellidoPaterno() + " " + paciente.getApellidoMaterno();
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, usuario, nombreCompleto);
    }

    // Login para médicos (similar pero con CMP)
    public AuthResponse loginMedico(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != Usuario.Rol.MEDICO) {
            throw new RuntimeException("El usuario no es un médico");
        }

        // Aquí podrías agregar lógica para obtener datos del médico
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, usuario, "Dr. " + usuario.getEmail().split("@")[0]);
    }
}