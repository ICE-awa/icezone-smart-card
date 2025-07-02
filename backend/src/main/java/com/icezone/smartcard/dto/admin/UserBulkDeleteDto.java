package com.icezone.smartcard.dto.admin;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class UserBulkDeleteDto {
    
    @NotEmpty(message = "要删除的用户名列表不能为空")
    private List<String> usernames;
}
