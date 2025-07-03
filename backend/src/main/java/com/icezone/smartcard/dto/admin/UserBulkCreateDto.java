package com.icezone.smartcard.dto.admin;

import com.icezone.smartcard.entity.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserBulkCreateDto {
    
    @NotBlank(message = "用户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;

    private Role role;
}
