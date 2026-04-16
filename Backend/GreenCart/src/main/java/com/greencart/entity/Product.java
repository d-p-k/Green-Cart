package com.greencart.entity;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@ElementCollection
	@Column(nullable = false)
	private List<String> description;

	@Column(nullable = false)
	private long price;

	@Column(nullable = false)
	private long offerPrice;

	@ElementCollection
	@Column(nullable = false)
	private List<String> images;

	@Column(nullable = false)
	private String category;

	@Column(nullable = false)
	private boolean inStock;

	@CreationTimestamp
	@Column(updatable = false, nullable = false)
	private Timestamp createdAt;

	@UpdateTimestamp
	private Timestamp updatedAt;

}
