package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {
    Optional<Especialidad> findByCodigo(String codigo);
    List<Especialidad> findByActivaTrue();
}