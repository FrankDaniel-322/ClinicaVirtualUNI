package pe.edu.uni.clinicavirtual.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "especialidades")
@Data
public class Especialidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String codigo;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    private String descripcion;
    
    @Column(nullable = false)
    private Boolean activa = true;
}