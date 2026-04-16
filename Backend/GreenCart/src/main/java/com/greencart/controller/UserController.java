package com.greencart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greencart.dto.LoginRequest;
import com.greencart.dto.RegisterationRequest;
import com.greencart.dto.UserResponse;
import com.greencart.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody RegisterationRequest request, HttpServletResponse response) {
		try {
			if (userService.doesUserExist(request))
				return new ResponseEntity<>("User already exists!", HttpStatus.CONFLICT); // 409
			userService.createUser(request, response);
			return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED); // 201
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		try {
			userService.loginUser(request, response);
			return new ResponseEntity<>("User logged in successfully!", HttpStatus.OK); // 200
		} catch (BadCredentialsException e) {
			return new ResponseEntity<>("Invalid email or password! - " + e.getMessage(), HttpStatus.UNAUTHORIZED); // 401
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/is-authenticated")
	public ResponseEntity<String> isAuthenticated() {
		try {
			if (userService.checkAuth())
				return new ResponseEntity<>("User is authenticated!", HttpStatus.OK); // 200
			return new ResponseEntity<>("User is not authenticated!", HttpStatus.UNAUTHORIZED); // 401
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/profile")
	public ResponseEntity<?> profile() {
		try {
			UserResponse userResponse = userService.userProfile();
			return new ResponseEntity<>(userResponse, HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletResponse response) {
		try {
			userService.logoutUser(response);
			return new ResponseEntity<>("User logged out successfully!", HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
