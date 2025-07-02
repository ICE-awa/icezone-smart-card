package com.icezone.smartcard.dto.auth;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String accessToken;
}
