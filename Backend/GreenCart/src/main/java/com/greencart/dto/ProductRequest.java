package com.greencart.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

	private String name;

	private List<String> description;

	private long price;

	private long offerPrice;

	private String category;

}
