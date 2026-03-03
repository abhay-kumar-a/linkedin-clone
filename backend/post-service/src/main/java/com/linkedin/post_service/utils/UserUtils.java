package com.linkedin.post_service.utils;

import jakarta.servlet.http.HttpServletRequest;
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
}
