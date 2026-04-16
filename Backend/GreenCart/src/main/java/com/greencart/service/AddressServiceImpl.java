package com.greencart.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.greencart.dto.AddressRequest;
import com.greencart.dto.AddressResponse;
import com.greencart.entity.Address;
import com.greencart.repository.AddressRepository;
import com.greencart.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

	private final UserRepository userRepository;

	private final AddressRepository addressRepository;

	@Override
	public void createAddress(AddressRequest request) {
		Address address = Address.builder().userId(request.getUserId()).firstName(request.getFirstName())
				.lastName(request.getLastName()).email(request.getEmail()).street(request.getStreet())
				.city(request.getCity()).state(request.getState()).zipcode(request.getZipcode())
				.country(request.getCountry()).phone(request.getPhone()).build();
		addressRepository.save(address);
	}

	@Override
	public AddressResponse getAddressById(Long id) throws RuntimeException {
		Address address = addressRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
		return mapToDto(address);
	}

	@Override
	public List<AddressResponse> getAddressesByUserId(Long userId) throws RuntimeException {
		if (!userRepository.existsById(userId))
			throw new RuntimeException("User not found with id: " + userId);
		List<Address> addresses = addressRepository.findByUserId(userId);
		List<AddressResponse> addressResponses = addresses.stream().map(this::mapToDto).collect(Collectors.toList());
		return addressResponses;
	}

	private AddressResponse mapToDto(Address address) {
		return AddressResponse.builder().id(address.getId()).userId(address.getUserId())
				.firstName(address.getFirstName()).lastName(address.getLastName()).email(address.getEmail())
				.street(address.getStreet()).city(address.getCity()).state(address.getState())
				.zipcode(address.getZipcode()).country(address.getCountry()).phone(address.getPhone()).build();
	}

}
