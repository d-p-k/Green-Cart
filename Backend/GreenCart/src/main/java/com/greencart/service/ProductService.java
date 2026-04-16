package com.greencart.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.greencart.dto.ProductResponse;
import com.greencart.dto.StockModificationRequest;

public interface ProductService {

	void createProduct(String productDataJson, MultipartFile[] images)
			throws JsonMappingException, JsonProcessingException, IOException;

	List<ProductResponse> getAllProducts();

	ProductResponse getProductById(Long id);

	void updateStockById(StockModificationRequest request);

	void deleteProduct(Long id) throws IOException;

}
