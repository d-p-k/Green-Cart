package com.greencart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.greencart.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.email = :email")
	User findByEmail(@Param("email") String email);

}
