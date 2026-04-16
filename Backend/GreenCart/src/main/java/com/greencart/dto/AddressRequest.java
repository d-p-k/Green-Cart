package com.greencart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

	private Long userId;

	private String firstName;

	private String lastName;

	private String email;

	private String street;

	private String city;

	private String state;

	private int zipcode;

	private String country;

	private String phone;

}
