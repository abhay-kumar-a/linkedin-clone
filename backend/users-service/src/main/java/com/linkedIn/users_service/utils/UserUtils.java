package com.linkedIn.users_service.utils;

import com.linkedIn.users_service.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class UserUtils {

    public long getUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null) {
            return Long.parseLong(userIdHeader);
        }
        return 1L;
    }

    public boolean isAdmin(HttpServletRequest request) {
        String rolesHeader = request.getHeader("X-User-Roles");
        return rolesHeader != null && rolesHeader.contains("ADMIN");
    }

    public void shouldBeAdmin(HttpServletRequest request) {
        if (!isAdmin(request)) {
            throw new ApiException(HttpStatus.FORBIDDEN ,"Access denied. Admin only.");
        }
    }

    public String getUserEmail(HttpServletRequest request) {
        String emailHeader = request.getHeader("X-User-Email");
        if (emailHeader != null) {
            return emailHeader;
        }
        return "user@example.com";
    }
}
