package com.linkedIn.users_service.validators.atLeastOneNotNull;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AtLeastOneNotNullValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface AtLeastOneNotNull {
    String message() default "At least one field must not be null";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
