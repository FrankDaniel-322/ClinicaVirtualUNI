package pe.edu.uni.clinicavirtual.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
@Data
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_documento", nullable = false)
    private String tipoDocumento;

    @Column(name = "numero_documento", unique = true, nullable = false)
    private String numeroDocumento;

    @Column(nullable = false)
    private String nombres;

    @Column(name = "apellido_paterno", nullable = false)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", nullable = false)
    private String apellidoMaterno;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    private String sexo;

    private String celular;
    private String departamento;
    private String provincia;
    private String distrito;
    private String direccion;

    @Column(name = "tipo_sangre")
    private String tipoSangre;

    private String alergias;

    @Column(name = "enfermedades_cronicas")
    private String enfermedadesCronicas;

    @Column(name = "medicamentos_actuales")
    private String medicamentosActuales;

    private String antecedentes;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}