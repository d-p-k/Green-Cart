package com.greencart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.greencart.dto.PaymentSalesResponse;
import com.greencart.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query("SELECT o FROM Order o WHERE o.userId = :userId AND (o.paymentType = :codType OR o.isPaid = true) ORDER BY o.createdAt DESC")
	List<Order> findByUserIdWithCODorPaid(@Param("userId") Long userId, @Param("codType") String codType);

	@Query("SELECT o FROM Order o WHERE (o.paymentType = :codType OR o.isPaid = true) ORDER BY o.createdAt DESC")
	List<Order> findAllWithCODorPaid(@Param("codType") String codType);

	@Query(value = """
			    SELECT payment_type AS paymentType, SUM(amount) AS totalSales
			    FROM orders GROUP BY payment_type
			""", nativeQuery = true)
	List<PaymentSalesResponse> getTotalSalesByPaymentType();

	@Query(value = "SELECT SUM(amount) FROM orders WHERE is_paid = true", nativeQuery = true)
	Long getTotalSalesOfPaidOrders();

}
