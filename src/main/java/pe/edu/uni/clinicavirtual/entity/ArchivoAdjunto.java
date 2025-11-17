package pe.edu.uni.clinicavirtual.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "archivos_adjuntos")
@Data
public class ArchivoAdjunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "consulta_id", nullable = false)
    private Consulta consulta;
    
    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;
    
    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;
    
    @Column(name = "tipo_archivo", length = 50)
    private String tipoArchivo;
    
    @Column(name = "tamano")
    private Long tamano;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}