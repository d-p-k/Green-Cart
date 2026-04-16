package com.greencart.service;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.greencart.dto.LoginRequest;
import com.greencart.dto.RegisterationRequest;
import com.greencart.dto.UserResponse;
import com.greencart.entity.User;
import com.greencart.repository.UserRepository;
import com.greencart.security.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	@Value("${jwt.expiration.ms}")
	private long JWT_EXPIRATION_MS;

	@Value("${app.environment}")
	private String APP_ENVIRONMENT;

	private final JwtUtil jwtUtil;

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authManager;

	@Override
	public boolean doesUserExist(RegisterationRequest request) {
		return userRepository.existsByEmail(request.getEmail());
	}

	@Override
	public void createUser(RegisterationRequest request, HttpServletResponse response) {
		User user = User.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).cartItems(new HashMap<>()).build();
		userRepository.save(user);
		String token = jwtUtil.generateToken(user.getEmail(), "USER");
		setTokenCookie(response, token);
	}

	@Override
	public void loginUser(LoginRequest request, HttpServletResponse response) {
		Authentication authentication = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		boolean isUser = authentication.getAuthorities().stream().anyMatch(a -> "ROLE_USER".equals(a.getAuthority()));
		if (!isUser)
			throw new BadCredentialsException("Not a user account");
		String token = jwtUtil.generateToken(request.getEmail(), "USER");
		setTokenCookie(response, token);
	}

	@Override
	public boolean checkAuth() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null && authentication.isAuthenticated() && authentication.getAuthorities().stream()
				.anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_USER"));
	}

	@Override
	public UserResponse userProfile() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authentication
				.getPrincipal();
		User savedUser = userRepository.findByEmail(user.getUsername());
		return UserResponse.builder().id(savedUser.getId()).name(savedUser.getName()).email(savedUser.getEmail())
				.cartItems(savedUser.getCartItems()).build();
	}

	@Override
	public void logoutUser(HttpServletResponse response) {
		String cookie = "";
		cookie += "jwtUserToken=" + "; ";
		cookie += "HttpOnly; "; // here only flag name required, value is true by default
		cookie += (APP_ENVIRONMENT.equals("prod") ? "Secure; " : ""); // here also only flag name required if production
		cookie += (APP_ENVIRONMENT.equals("prod") ? "SameSite=" + "None; " : "SameSite=" + "Strict; ");
		cookie += "Path=" + "/; ";
		cookie += "Max-Age=" + "0";
		response.setHeader("Set-Cookie", cookie);
	}

	private void setTokenCookie(HttpServletResponse response, String token) {
		String cookie = "";
		cookie += "jwtUserToken=" + token + "; ";
		cookie += "HttpOnly; "; // here only flag name required, value is true by default
		cookie += (APP_ENVIRONMENT.equals("prod") ? "Secure; " : ""); // here also only flag name required if production
		cookie += (APP_ENVIRONMENT.equals("prod") ? "SameSite=" + "None; " : "SameSite=" + "Strict; ");
		cookie += "Path=" + "/; ";
		cookie += "Max-Age=" + (int) (JWT_EXPIRATION_MS / 1000);
		response.setHeader("Set-Cookie", cookie);
	}

}
