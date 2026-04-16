package com.greencart.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	@Value("${frontend.url}")
	private String FRONTEND_URL;

	private static final String[] PUBLIC_ENDPOINTS = { // ---------------------------------------------------------------------------------
			"/api/user/register", // ------------------------------------------------------------------------------------------------------
			"/api/user/login", // ---------------------------------------------------------------------------------------------------------
			"/api/user/is-authenticated", // ----------------------------------------------------------------------------------------------
			"/api/seller/login", // -------------------------------------------------------------------------------------------------------
			"/api/seller/is-authenticated", // --------------------------------------------------------------------------------------------
			"/api/product/list", // -------------------------------------------------------------------------------------------------------
			"/api/product/\\d+" };

	private static final String[] USER_ENDPOINTS = { // -----------------------------------------------------------------------------------
			"/api/user/profile", // -------------------------------------------------------------------------------------------------------
			"/api/user/logout", // --------------------------------------------------------------------------------------------------------
			"/api/address/add", // --------------------------------------------------------------------------------------------------------
			"/api/order/cod", // ----------------------------------------------------------------------------------------------------------
			"/api/order/online", // -------------------------------------------------------------------------------------------------------
			"/api/order/verify", // -------------------------------------------------------------------------------------------------------
			"/api/order/user/\\d+", // ----------------------------------------------------------------------------------------------------
			"/api/order/\\d+", // ---------------------------------------------------------------------------------------------------------
			"/api/cart/modify" };

	private static final String[] SELLER_ENDPOINTS = { // ---------------------------------------------------------------------------------
			"/api/seller/stats", // ---------------------------------------------------------------------------------------------------
			"/api/seller/logout", // ------------------------------------------------------------------------------------------------------
			"/api/product/add", // --------------------------------------------------------------------------------------------------------
			"/api/product/stock", // ------------------------------------------------------------------------------------------------------
			"/api/product/\\d+", // -------------------------------------------------------------------------------------------------------
			"/api/address/\\d+", // -------------------------------------------------------------------------------------------------------
			"/api/address/user/\\d+", // --------------------------------------------------------------------------------------------------
			"/api/order/seller" };

	private final JwtAuthenticationFilter jwtFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth.requestMatchers(PUBLIC_ENDPOINTS).permitAll()
						.requestMatchers(USER_ENDPOINTS).hasRole("USER").requestMatchers(SELLER_ENDPOINTS)
						.hasRole("SELLER").anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.logout(AbstractHttpConfigurer::disable)
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsFilter corsFilter() {
		return new CorsFilter(corsConfigurationSource());
	}

	private CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173", FRONTEND_URL));
		corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		corsConfiguration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfiguration);
		return source;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

}
