package pe.edu.uni.clinicavirtual.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}

class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}