package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Usuario> findByEmailAndActivoTrue(String email);
}