package com.icezone.smartcard.dto.auth;

import com.icezone.smartcard.entity.Role;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private Role role;
}
