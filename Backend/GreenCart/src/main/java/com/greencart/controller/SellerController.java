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
import com.greencart.dto.StatsResponse;
import com.greencart.service.SellerService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller")
public class SellerController {

	private final SellerService sellerService;

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginRequest request, HttpServletResponse response) {
		try {
			sellerService.loginSeller(request, response);
			return new ResponseEntity<>("Seller logged in successfully!", HttpStatus.OK); // 200
		} catch (BadCredentialsException e) {
			return new ResponseEntity<>("Invalid email or password! - " + e.getMessage(), HttpStatus.UNAUTHORIZED); // 401
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/is-authenticated")
	public ResponseEntity<String> isAuthenticated() {
		try {
			if (sellerService.checkAuth())
				return new ResponseEntity<>("Seller is authenticated!", HttpStatus.OK); // 200
			return new ResponseEntity<>("Seller is not authenticated!", HttpStatus.UNAUTHORIZED); // 401
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/stats")
	public ResponseEntity<?> stats() {
		try {
			StatsResponse response = sellerService.getStats();
			return new ResponseEntity<>(response, HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(HttpServletResponse response) {
		try {
			sellerService.logoutSeller(response);
			return new ResponseEntity<>("Seller logged out successfully!", HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
