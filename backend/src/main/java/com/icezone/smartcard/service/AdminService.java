package com.icezone.smartcard.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icezone.smartcard.dto.admin.UserAddRequestDto;
import com.icezone.smartcard.dto.admin.UserBulkCreateDto;
import com.icezone.smartcard.dto.user.UserResponseDto;
import com.icezone.smartcard.entity.Role;
import com.icezone.smartcard.entity.User;
import com.icezone.smartcard.repository.UserRepository;

@Service
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void bulkAddUsers(List<UserBulkCreateDto> usersToAdd) {
        for (UserBulkCreateDto dto : usersToAdd) {
            if(userRepository.existsByUsername(dto.getUsername())) {
                throw new IllegalArgumentException("用户名 '" + dto.getUsername() + "' 已存在，批量新增失败！");
            }
            User user = new User();
            user.setUsername(dto.getUsername());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setRole(dto.getRole() == null ? Role.USER : dto.getRole());
            userRepository.save(user);
        }
    }

    @Transactional
    public void bulkDeleteUsers(List<String> usernames) {
        userRepository.deleteByUsernameIn(usernames);
    }

    public List<UserResponseDto> getAllUser() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(user -> new UserResponseDto(user.getId(), user.getUsername(), user.getRole()))
            .collect(Collectors.toList());
    }

    public void deleteUserById(Long userId) {
        User userToDelete = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("ID 为 " + userId + " 的用户不存在"));
        
        String currentAdminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userToDelete.getUsername().equals(currentAdminUsername)) {
            throw new IllegalArgumentException("操作失败：管理员不能删除自己！");
        }

        userRepository.deleteById(userId);
    }

    public void addUser(UserAddRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new IllegalArgumentException("用户名 '" + requestDto.getUsername() + "' 已经存在！");
        }
        
        User user = new User();
        user.setUsername(requestDto.getUsername());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        user.setRole(requestDto.getRole());

        userRepository.save(user);
    }
}
