package pe.edu.uni.clinicavirtual.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "respuestas_medicas")
@Data
public class RespuestaMedica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "consulta_id", nullable = false)
    private Consulta consulta;
    
    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnostico;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String recomendaciones;
    
    @Column(name = "medicamentos_recetados", columnDefinition = "TEXT")
    private String medicamentosRecetados;
    
    @Column(name = "proximo_control")
    private LocalDateTime proximoControl;
    
    @Column(name = "archivo_receta")
    private String archivoReceta;
    
    @Column(name = "fecha_respuesta", nullable = false)
    private LocalDateTime fechaRespuesta = LocalDateTime.now();
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}