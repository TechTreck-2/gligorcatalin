package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private ErrorDetails error;
    
    public ApiResponse(T data) {
        this.data = data;
        this.error = null;
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data);
    }
    
    public static <T> ApiResponse<T> error(ErrorDetails error) {
        return new ApiResponse<>(null, error);
    }
}
