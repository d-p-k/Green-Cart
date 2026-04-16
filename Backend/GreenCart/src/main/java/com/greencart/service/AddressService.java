package com.greencart.service;

import java.util.List;

import com.greencart.dto.AddressRequest;
import com.greencart.dto.AddressResponse;

public interface AddressService {

	void createAddress(AddressRequest request);

	AddressResponse getAddressById(Long id) throws RuntimeException;

	List<AddressResponse> getAddressesByUserId(Long userId) throws RuntimeException;

}
