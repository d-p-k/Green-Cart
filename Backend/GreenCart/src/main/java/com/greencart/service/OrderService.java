package com.greencart.service;

import java.util.List;

import com.greencart.dto.OrderRequest;
import com.greencart.dto.OrderResponse;
import com.greencart.dto.PaymentVerificationRequest;
import com.greencart.dto.PaymentVerificationResponse;
import com.razorpay.RazorpayException;

public interface OrderService {

	void createOrderCOD(OrderRequest request) throws IllegalArgumentException, RuntimeException;

	PaymentVerificationResponse createOrderOnline(OrderRequest request)
			throws IllegalArgumentException, RuntimeException, RazorpayException;

	List<OrderResponse> getOrdersByUserId(Long userId) throws RuntimeException;

	List<OrderResponse> getAllOrders();

	void verifyAndSaveOrder(PaymentVerificationRequest request) throws RazorpayException, RuntimeException;

	void deleteOrderById(Long id);

}
