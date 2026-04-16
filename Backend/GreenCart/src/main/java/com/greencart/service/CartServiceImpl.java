package com.greencart.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.greencart.dto.CartModificationRequest;
import com.greencart.entity.User;
import com.greencart.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

	private final UserRepository userRepository;

	@Override
	public void updateCartItems(CartModificationRequest request) {
		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found!"));
		Map<Long, Integer> cartItems = user.getCartItems();
		if (request.getQuantity() == 0)
			cartItems.remove(request.getProductId());
		else
			cartItems.put(request.getProductId(), request.getQuantity());
		user.setCartItems(cartItems);
		userRepository.save(user);
	}

}
