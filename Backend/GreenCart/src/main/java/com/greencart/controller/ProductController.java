package com.greencart.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.greencart.dto.ProductResponse;
import com.greencart.dto.StockModificationRequest;
import com.greencart.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

	private final ProductService productService;

	@PostMapping("/add")
	public ResponseEntity<String> addProduct(@RequestPart("productDataJson") String productDataJson,
			@RequestPart("images") MultipartFile[] images) {
		try {
			productService.createProduct(productDataJson, images);
			return new ResponseEntity<>("Product added successfully!", HttpStatus.CREATED); // 201
		} catch (JsonMappingException e) {
			return new ResponseEntity<>("Invalid product data format! - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (JsonProcessingException e) {
			return new ResponseEntity<>("Error while processing JSON! - " + e.getMessage(), HttpStatus.BAD_REQUEST); // 400
		} catch (IOException e) {
			return new ResponseEntity<>("Error while uploading images! - " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR); // 500
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/list")
	public ResponseEntity<?> productList() {
		try {
			List<ProductResponse> productResponses = productService.getAllProducts();
			return new ResponseEntity<>(productResponses, HttpStatus.OK); // 200
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> productById(@PathVariable Long id) {
		try {
			ProductResponse productResponse = productService.getProductById(id);
			return new ResponseEntity<>(productResponse, HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PutMapping("/stock")
	public ResponseEntity<String> modifyStock(@RequestBody StockModificationRequest request) {
		try {
			productService.updateStockById(request);
			return new ResponseEntity<>("Stock updated successfully!", HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

	@PostMapping("/{id}")
	public ResponseEntity<String> removeProduct(@PathVariable Long id) {
		try {
			productService.deleteProduct(id);
			return new ResponseEntity<>("Product removed successfully!", HttpStatus.OK); // 200
		} catch (RuntimeException e) {
			return new ResponseEntity<>("Error while finding product - " + e.getMessage(), HttpStatus.NOT_FOUND); // 404
		} catch (IOException e) {
			return new ResponseEntity<>("Error while deleting images! - " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR); // 500
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong! - " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // 500
		}
	}

}
