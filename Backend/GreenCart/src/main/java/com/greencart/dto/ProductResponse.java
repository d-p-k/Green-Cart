package com.greencart.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

	private Long id;

	private String name;

	private List<String> description;

	private long price;

	private long offerPrice;

	private List<String> images;

	private String category;

	private boolean inStock;

}
