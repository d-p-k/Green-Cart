package com.greencart.service;

import com.greencart.dto.LoginRequest;
import com.greencart.dto.StatsResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface SellerService {

	void loginSeller(LoginRequest request, HttpServletResponse response);

	boolean checkAuth();

	void logoutSeller(HttpServletResponse response);

	StatsResponse getStats();

}
