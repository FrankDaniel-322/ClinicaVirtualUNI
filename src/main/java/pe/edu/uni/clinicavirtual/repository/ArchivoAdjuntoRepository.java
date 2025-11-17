package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.ArchivoAdjunto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArchivoAdjuntoRepository extends JpaRepository<ArchivoAdjunto, Long> {
    List<ArchivoAdjunto> findByConsultaId(Long consultaId);
    void deleteByConsultaId(Long consultaId);
}