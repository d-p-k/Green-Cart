package com.greencart.service;

import com.greencart.dto.CartModificationRequest;

public interface CartService {

	void updateCartItems(CartModificationRequest request);

}
