package com.greencart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greencart.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

	List<Address> findByUserId(Long userId);

}
