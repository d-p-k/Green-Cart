package com.greencart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.greencart.dto.CategorySalesResponse;
import com.greencart.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

	@Query(value = """
				SELECT p.category AS category, SUM(p.offer_price * oi.quantity) AS totalSales
				FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.category
			""", nativeQuery = true)
	List<CategorySalesResponse> getTotalSalesByCategory();

}
