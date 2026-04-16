package com.greencart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartModificationRequest {

	private Long userId;

	private Long productId;

	private Integer quantity;

}
