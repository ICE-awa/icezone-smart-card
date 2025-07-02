package com.icezone.smartcard.service;

import com.icezone.smartcard.dto.admin.UserBulkCreateDto;
import com.icezone.smartcard.entity.Role;
import com.icezone.smartcard.entity.User;
import com.icezone.smartcard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
