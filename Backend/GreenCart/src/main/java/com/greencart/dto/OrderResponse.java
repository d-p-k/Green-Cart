package com.greencart.dto;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

	private Long id;

	private Long userId;

	private List<OrderItemResponse> items;

	private Long amount;

	private Long addressId;

	private String status;

	private String paymentType;

	private Boolean isPaid;

	private Timestamp createdAt;

	private Timestamp updatedAt;

}
