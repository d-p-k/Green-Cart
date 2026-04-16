package com.greencart.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greencart.dto.AddressRequest;
import com.greencart.dto.AddressResponse;
import com.greencart.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/address")
public class AddressController {

	private final AddressService addressService;

	@PostMapping("/add")
	public ResponseEntity<String> addAddress(@RequestBody AddressRequest request) {
		try {
			addressService.createAddress(request);
			return new ResponseEntity<>("Address added successfully!", HttpStatus.CREATED); // 201
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> addressById(@PathVariable Long id) {
		try {
			AddressResponse addressResponse = addressService.getAddressById(id);
			return new ResponseEntity<>(addressResponse, HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding address - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> addressesByUserId(@PathVariable Long userId) {
		try {
			List<AddressResponse> addressResponses = addressService.getAddressesByUserId(userId);
			return new ResponseEntity<>(addressResponses, HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding user - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
