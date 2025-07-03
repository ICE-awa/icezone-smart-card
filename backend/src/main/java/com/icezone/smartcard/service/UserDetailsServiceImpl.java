package com.icezone.smartcard.service;

import com.icezone.smartcard.entity.User;
import com.icezone.smartcard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
    
    @Autowired
    private UserRepository userRepository;

    /**
     * 在需要验证用户时，调用这个方法，传入用户名，返回用户完整信息
     * @param username 传入的用户名
     * @return UserDetails 对象，包含密码、权限等
     * @throws UsernameNotFoundException 如果用户不存在，则抛出此异常。
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("找不到用户" + username));

        Collection<? extends GrantedAuthority> authorities =
            Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}
