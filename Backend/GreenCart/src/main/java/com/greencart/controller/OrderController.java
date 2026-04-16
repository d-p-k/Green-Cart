package com.greencart.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greencart.dto.OrderRequest;
import com.greencart.dto.OrderResponse;
import com.greencart.dto.PaymentVerificationRequest;
import com.greencart.dto.PaymentVerificationResponse;
import com.greencart.service.OrderService;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {

	private final OrderService orderService;

	@PostMapping("/cod")
	public ResponseEntity<String> placeOrderCOD(@RequestBody OrderRequest request) {
		try {
			orderService.createOrderCOD(request);
			return new ResponseEntity<>("Order placed successfully.", HttpStatus.CREATED); // 201
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>("Error while checking request! - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product! - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/online")
	public ResponseEntity<?> placeOrderOnline(@RequestBody OrderRequest request) {
		try {
			PaymentVerificationResponse response = orderService.createOrderOnline(request);
			return new ResponseEntity<>(response, HttpStatus.OK); // 200
		} catch (RazorpayException e) {
			return new ResponseEntity<>("Error while calling razorpay - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>("Error while checking request! - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product! - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/verify")
	public ResponseEntity<String> onlinePaymentVerification(@RequestBody PaymentVerificationRequest request) {
		try {
			orderService.verifyAndSaveOrder(request);
			return new ResponseEntity<>("Order placed successfully.", HttpStatus.OK); // 200
		} catch (RazorpayException e) {
			return new ResponseEntity<>("Error while calling razorpay - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product! - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<?> ordersByUserId(@PathVariable Long userId) {
		try {
			List<OrderResponse> orderResponses = orderService.getOrdersByUserId(userId);
			return new ResponseEntity<>(orderResponses, HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding user - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/seller")
	public ResponseEntity<?> allOrders() {
		try {
			List<OrderResponse> orderResponses = orderService.getAllOrders();
			return new ResponseEntity<>(orderResponses, HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
		try {
			orderService.deleteOrderById(id);
			return new ResponseEntity<>("Order deleted successfully.", HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
