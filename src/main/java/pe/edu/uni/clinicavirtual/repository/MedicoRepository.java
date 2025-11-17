package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByCmp(String cmp);
    Optional<Medico> findByUsuarioEmail(String email);
    Boolean existsByCmp(String cmp);
}