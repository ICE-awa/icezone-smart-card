package com.icezone.smartcard.dto.auth;

import com.icezone.smartcard.dto.user.UserResponseDto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private UserResponseDto user;
}
