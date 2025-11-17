package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.SintomaConsulta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SintomaConsultaRepository extends JpaRepository<SintomaConsulta, Long> {
    List<SintomaConsulta> findByConsultaId(Long consultaId);
    void deleteByConsultaId(Long consultaId);
}