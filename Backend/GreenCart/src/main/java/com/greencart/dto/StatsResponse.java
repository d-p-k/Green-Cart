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
public class StatsResponse {

	private Long totalUsers;

	private Long totalProducts;

	private Long totalOrders;

	private Long totalSales;

	private List<CategorySalesResponse> CategorySalesResponses;

	private List<PaymentSalesResponse> PaymentSalesResponses;

}
