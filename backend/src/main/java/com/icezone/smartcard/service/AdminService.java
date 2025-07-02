package com.icezone.smartcard.service;

import com.icezone.smartcard.dto.admin.UserBulkCreateDto;
import com.icezone.smartcard.dto.user.UserResponseDto;
import com.icezone.smartcard.entity.Role;
import com.icezone.smartcard.entity.User;
import com.icezone.smartcard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
}
