package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByNumeroDocumento(String numeroDocumento);
    Optional<Paciente> findByUsuarioEmail(String email);
    Boolean existsByNumeroDocumento(String numeroDocumento);
}