package com.icezone.smartcard.dto.auth;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private UserDto user;
}
