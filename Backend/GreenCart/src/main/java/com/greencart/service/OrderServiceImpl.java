package com.greencart.service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.greencart.dto.OrderItemRequest;
import com.greencart.dto.OrderItemResponse;
import com.greencart.dto.OrderRequest;
import com.greencart.dto.OrderResponse;
import com.greencart.dto.PaymentVerificationRequest;
import com.greencart.dto.PaymentVerificationResponse;
import com.greencart.entity.Order;
import com.greencart.entity.OrderItem;
import com.greencart.entity.Product;
import com.greencart.entity.User;
import com.greencart.repository.OrderRepository;
import com.greencart.repository.ProductRepository;
import com.greencart.repository.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

	@Value("${razorpay.key.id}")
	private String RAZORPAY_KEY_ID;

	@Value("${razorpay.key.secret}")
	private String RAZORPAY_KEY_SECRET;

	private final ProductRepository productRepository;

	private final UserRepository userRepository;

	private final OrderRepository orderRepository;

	@Override
	public void createOrderCOD(OrderRequest request) throws IllegalArgumentException, RuntimeException {
		if (request.getAddressId() == null || request.getItems().isEmpty())
			throw new IllegalArgumentException("Invalid address id or items");

		Long amount = 0L;

		for (OrderItemRequest item : request.getItems()) {
			Product product = productRepository.findById(item.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
			amount += (product.getOfferPrice() * item.getQuantity());
		}

		// Adding tax (2%)
		amount += (long) Math.floor(amount * 0.02);

		List<OrderItem> orderItems = request.getItems().stream()
				.map(item -> OrderItem.builder().productId(item.getProductId()).quantity(item.getQuantity()).build())
				.toList();

		Order order = Order.builder().userId(request.getUserId()).items(orderItems).amount(amount)
				.addressId(request.getAddressId()).status("ORDER PLACED").paymentType("COD").isPaid(true).build();

		orderRepository.save(order);

		User savedUser = userRepository.findById(request.getUserId()).orElse(null);
		savedUser.setCartItems(new HashMap<>());
		userRepository.save(savedUser);
	}

	@Override
	public PaymentVerificationResponse createOrderOnline(OrderRequest request)
			throws IllegalArgumentException, RuntimeException, RazorpayException {
		if (request.getAddressId() == null || request.getItems().isEmpty())
			throw new IllegalArgumentException("Invalid address id or items");

		Long amount = 0L;

		for (OrderItemRequest item : request.getItems()) {
			Product product = productRepository.findById(item.getProductId())
					.orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
			amount += (product.getOfferPrice() * item.getQuantity());
		}

		// Adding tax (2%)
		amount += (long) Math.floor(amount * 0.02);

		List<OrderItem> orderItems = request.getItems().stream()
				.map(item -> OrderItem.builder().productId(item.getProductId()).quantity(item.getQuantity()).build())
				.toList();

		Order order = Order.builder().userId(request.getUserId()).items(orderItems).amount(amount)
				.addressId(request.getAddressId()).status("VERIFICATION PENDING").paymentType("ONLINE").isPaid(true)
				.build();

		Order savedOrder = orderRepository.save(order);

		RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("amount", amount * 100L);
		jsonObject.put("currency", "INR");
		jsonObject.put("receipt", String.valueOf(savedOrder.getId()));

		com.razorpay.Order razorpayOrder = razorpayClient.orders.create(jsonObject);
		JSONObject orderJson = razorpayOrder.toJson();

		PaymentVerificationResponse response = PaymentVerificationResponse.builder().orderId(savedOrder.getId())
				.razorpayOrderId(orderJson.getString("id")).build();

		return response;
	}

	@Override
	public void verifyAndSaveOrder(PaymentVerificationRequest request) throws RazorpayException, RuntimeException {
		JSONObject jsonObject = new JSONObject();

		jsonObject.put("razorpay_payment_id", request.getRazorpayPaymentId());
		jsonObject.put("razorpay_order_id", request.getRazorpayOrderId());
		jsonObject.put("razorpay_signature", request.getRazorpaySignature());

		boolean status = Utils.verifyPaymentSignature(jsonObject, RAZORPAY_KEY_SECRET);

		if (!status) {
			deleteOrderById(request.getOrderId());
			throw new RuntimeException("Payment verification failed.");
		}

		Order savedOrder = orderRepository.findById(request.getOrderId())
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));
		savedOrder.setStatus("ORDER PLACED");
		orderRepository.save(savedOrder);

		User savedUser = userRepository.findById(savedOrder.getUserId()).orElse(null);
		savedUser.setCartItems(new HashMap<>());
		userRepository.save(savedUser);
	}

	@Override
	public List<OrderResponse> getOrdersByUserId(Long userId) throws RuntimeException {
		if (!userRepository.existsById(userId))
			throw new RuntimeException("User not found with id: " + userId);
		List<Order> orders = orderRepository.findByUserIdWithCODorPaid(userId, "COD");
		List<OrderResponse> orderResponses = orders.stream().map(this::mapToDto).collect(Collectors.toList());
		return orderResponses;
	}

	@Override
	public List<OrderResponse> getAllOrders() {
		List<Order> orders = orderRepository.findAllWithCODorPaid("COD");
		List<OrderResponse> orderResponses = orders.stream().map(this::mapToDto).collect(Collectors.toList());
		return orderResponses;
	}

	@Override
	public void deleteOrderById(Long id) {
		orderRepository.deleteById(id);
	}

	private OrderResponse mapToDto(Order order) {
		return OrderResponse.builder().id(order.getId()).userId(order.getUserId())
				.items(order.getItems().stream()
						.map(item -> OrderItemResponse.builder().id(item.getId()).productId(item.getProductId())
								.quantity(item.getQuantity()).build())
						.toList())
				.amount(order.getAmount()).addressId(order.getAddressId()).status(order.getStatus())
				.paymentType(order.getPaymentType()).isPaid(order.getIsPaid()).createdAt(order.getCreatedAt())
				.updatedAt(order.getUpdatedAt()).build();
	}

}
