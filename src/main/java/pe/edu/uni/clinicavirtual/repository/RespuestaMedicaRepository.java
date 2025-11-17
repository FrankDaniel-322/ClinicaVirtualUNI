package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.RespuestaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RespuestaMedicaRepository extends JpaRepository<RespuestaMedica, Long> {
    Optional<RespuestaMedica> findByConsultaId(Long consultaId);
}