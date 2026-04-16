package com.greencart.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greencart.dto.ProductRequest;
import com.greencart.dto.ProductResponse;
import com.greencart.dto.StockModificationRequest;
import com.greencart.entity.Product;
import com.greencart.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final Cloudinary cloudinary;

	private final ProductRepository productRepository;

	@Override
	public void createProduct(String productDataJson, MultipartFile[] images)
			throws JsonMappingException, JsonProcessingException, IOException {
		// Step 1: Parse productData JSON string to ProductRequest DTO
		ObjectMapper mapper = new ObjectMapper();
		ProductRequest request = mapper.readValue(productDataJson, ProductRequest.class);
		// Step 2: Upload images to Cloudinary and get secure URLs
		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile image : images) {
			String imageUrl = uploadImage(image);
			imageUrls.add(imageUrl);
		}
		Product product = Product.builder().name(request.getName()).description(request.getDescription())
				.price(request.getPrice()).offerPrice(request.getOfferPrice()).images(imageUrls)
				.category(request.getCategory()).inStock(true).build();
		productRepository.save(product);
	}

	private String uploadImage(MultipartFile image) throws IOException {
		Map<?, ?> result = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap("resource_type", "image"));
		return result.get("secure_url").toString();
	}

	@Override
	public List<ProductResponse> getAllProducts() {
		List<Product> products = productRepository.findAll();
		List<ProductResponse> productResponses = products.stream().map(this::mapToDto).collect(Collectors.toList());
		return productResponses;
	}

	private ProductResponse mapToDto(Product product) {
		return ProductResponse.builder().id(product.getId()).name(product.getName())
				.description(product.getDescription()).price(product.getPrice()).offerPrice(product.getOfferPrice())
				.images(product.getImages()).category(product.getCategory()).inStock(product.isInStock()).build();
	}

	@Override
	public ProductResponse getProductById(Long id) throws RuntimeException {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
		return mapToDto(product);
	}

	@Override
	public void updateStockById(StockModificationRequest request) throws RuntimeException {
		Product product = productRepository.findById(request.getId())
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getId()));
		product.setInStock(request.isInStock());
		productRepository.save(product);
	}

	@Override
	public void deleteProduct(Long id) throws RuntimeException, IOException {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
		for (String imageUrl : product.getImages()) {
			String publicId = extractPublicIdFromUrl(imageUrl);
			cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
		}
		productRepository.delete(product);
	}

	private String extractPublicIdFromUrl(String url) {
		int startIndex = url.lastIndexOf("/") + 1;
		int endIndex = url.lastIndexOf(".");
		return url.substring(startIndex, endIndex);
	}

}
