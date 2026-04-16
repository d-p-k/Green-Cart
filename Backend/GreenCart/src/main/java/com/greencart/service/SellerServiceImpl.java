package com.greencart.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.greencart.dto.LoginRequest;
import com.greencart.dto.StatsResponse;
import com.greencart.repository.OrderItemRepository;
import com.greencart.repository.OrderRepository;
import com.greencart.repository.ProductRepository;
import com.greencart.repository.UserRepository;
import com.greencart.security.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

	@Value("${jwt.expiration.ms}")
	private long JWT_EXPIRATION_MS;

	@Value("${app.environment}")
	private String APP_ENVIRONMENT;

	private final JwtUtil jwtUtil;

	private final AuthenticationManager authManager;

	private final UserRepository userRepository;

	private final ProductRepository productRepository;

	private final OrderRepository orderRepository;

	private final OrderItemRepository orderItemRepository;

	@Override
	public void loginSeller(LoginRequest request, HttpServletResponse response) {
		Authentication authentication = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
		boolean isSeller = authentication.getAuthorities().stream()
				.anyMatch(a -> "ROLE_SELLER".equals(a.getAuthority()));
		if (!isSeller)
			throw new BadCredentialsException("Not a seller account");
		String token = jwtUtil.generateToken(request.getEmail(), "SELLER");
		setTokenCookie(response, token);
	}

	@Override
	public boolean checkAuth() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null && authentication.isAuthenticated() && authentication.getAuthorities().stream()
				.anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_SELLER"));
	}

	@Override
	public StatsResponse getStats() {
		StatsResponse response = new StatsResponse();
		response.setTotalUsers(userRepository.count());
		response.setTotalProducts(productRepository.count());
		response.setTotalOrders(orderRepository.count());
		response.setTotalSales(orderRepository.getTotalSalesOfPaidOrders());
		response.setCategorySalesResponses(orderItemRepository.getTotalSalesByCategory());
		response.setPaymentSalesResponses(orderRepository.getTotalSalesByPaymentType());
		return response;
	}

	@Override
	public void logoutSeller(HttpServletResponse response) {
		String cookie = "";
		cookie += "jwtSellerToken=" + "; ";
		cookie += "HttpOnly; "; // here only flag name required, value is true by default
		cookie += (APP_ENVIRONMENT.equals("prod") ? "Secure; " : ""); // here also only flag name required if production
		cookie += (APP_ENVIRONMENT.equals("prod") ? "SameSite=" + "None; " : "SameSite=" + "Strict; ");
		cookie += "Path=" + "/; ";
		cookie += "Max-Age=" + "0";
		response.setHeader("Set-Cookie", cookie);
	}

	private void setTokenCookie(HttpServletResponse response, String token) {
		String cookie = "";
		cookie += "jwtSellerToken=" + token + "; ";
		cookie += "HttpOnly; "; // here only flag name required, value is true by default
		cookie += (APP_ENVIRONMENT.equals("prod") ? "Secure; " : ""); // here also only flag name required if production
		cookie += (APP_ENVIRONMENT.equals("prod") ? "SameSite=" + "None; " : "SameSite=" + "Strict; ");
		cookie += "Path=" + "/; ";
		cookie += "Max-Age=" + (int) (JWT_EXPIRATION_MS / 1000);
		response.setHeader("Set-Cookie", cookie);
	}

}
