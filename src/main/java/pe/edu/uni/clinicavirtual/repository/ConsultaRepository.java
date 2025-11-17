package pe.edu.uni.clinicavirtual.repository;

import pe.edu.uni.clinicavirtual.entity.Consulta;
import pe.edu.uni.clinicavirtual.entity.Consulta.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByPacienteIdOrderByFechaSolicitudDesc(Long pacienteId);
    List<Consulta> findByMedicoIdOrderByFechaSolicitudDesc(Long medicoId);
    List<Consulta> findByEstadoOrderByFechaSolicitudDesc(Estado estado);
    List<Consulta> findByPacienteUsuarioEmailOrderByFechaSolicitudDesc(String email);
    
    @Query("SELECT c FROM Consulta c WHERE c.medico.id = :medicoId AND c.estado = 'PENDIENTE' ORDER BY c.urgencia DESC, c.fechaSolicitud ASC")
    List<Consulta> findConsultasPendientesByMedico(@Param("medicoId") Long medicoId);
    
    @Query("SELECT COUNT(c) FROM Consulta c WHERE c.estado = 'PENDIENTE'")
    Long countConsultasPendientes();
}