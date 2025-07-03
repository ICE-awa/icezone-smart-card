package com.icezone.smartcard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icezone.smartcard.dto.admin.UserBulkCreateDto;
import com.icezone.smartcard.dto.admin.UserBulkDeleteDto;
import com.icezone.smartcard.dto.user.UserResponseDto;
import com.icezone.smartcard.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;

    @PostMapping("/users/batch-add")
    public ResponseEntity<?> bulkAddUsers(@Valid @RequestBody List<UserBulkCreateDto> usersToAdd) {
        try {
            adminService.bulkAddUsers(usersToAdd);
            return ResponseEntity.ok("批量新增用户成功！");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/batch-delete")
    public ResponseEntity<?> bulkDeleteUsers(@Valid @RequestBody UserBulkDeleteDto usersToDelete) {
        adminService.bulkDeleteUsers(usersToDelete.getUsernames());
        return ResponseEntity.ok("批量删除用户成功！");
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> allUsers = adminService.getAllUser();
        return ResponseEntity.ok(allUsers);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUserById(userId);
            return ResponseEntity.ok("ID为 " + userId + " 的用户删除成功！");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
