package admin_user.service;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

	private static final String ADMIN_ROLE = "ADMIN";
	private static final String USER_ROLE = "USER";

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
										Authentication authentication) throws IOException, ServletException {

		var authourities = authentication.getAuthorities();
		var roles = authourities.stream().map(r -> r.getAuthority()).findFirst();

		if (ADMIN_ROLE.equals(roles.orElse(""))) {
			response.sendRedirect("/admin-page");
		} else if (USER_ROLE.equals(roles.orElse(""))) {
			response.sendRedirect("/user-page");
		} else {
			response.sendRedirect("/error");
		}
	}
}