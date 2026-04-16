package com.greencart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {

	private Long orderId;

	private String razorpayPaymentId;

	private String razorpayOrderId;

	private String razorpaySignature;

}
