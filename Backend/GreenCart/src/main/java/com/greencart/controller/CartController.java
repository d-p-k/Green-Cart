package com.greencart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greencart.dto.CartModificationRequest;
import com.greencart.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

	private final CartService cartService;

	@PutMapping("/modify")
	public ResponseEntity<String> modifyCartItems(@RequestBody CartModificationRequest request) {
		try {
			cartService.updateCartItems(request);
			return new ResponseEntity<>("Cart updated successfully!", HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding user - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
