package com.greencart.service;

import com.greencart.dto.LoginRequest;
import com.greencart.dto.RegisterationRequest;
import com.greencart.dto.UserResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface UserService {

	boolean doesUserExist(RegisterationRequest request);

	void createUser(RegisterationRequest request, HttpServletResponse response);

	void loginUser(LoginRequest request, HttpServletResponse response);

	boolean checkAuth();

	UserResponse userProfile();

	void logoutUser(HttpServletResponse response);

}
