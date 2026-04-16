package com.greencart.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.greencart.entity.User;
import com.greencart.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	@Value("${credential.seller.email}")
	private String CREDENTIAL_SELLER_EMAIL;

	@Value("${credential.seller.password}")
	private String CREDENTIAL_SELLER_PASSWORD;

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) {
		if (email.equals(CREDENTIAL_SELLER_EMAIL))
			return org.springframework.security.core.userdetails.User.builder().username(CREDENTIAL_SELLER_EMAIL)
					.password(CREDENTIAL_SELLER_PASSWORD).authorities(new SimpleGrantedAuthority("ROLE_SELLER"))
					.build();

		User user = userRepository.findByEmail(email);
		if (user == null)
			throw new UsernameNotFoundException("User not found: " + email);

		return org.springframework.security.core.userdetails.User.builder().username(user.getEmail())
				.password(user.getPassword()).authorities(new SimpleGrantedAuthority("ROLE_USER")).build();
	}

}