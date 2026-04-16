package com.greencart.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greencart.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
