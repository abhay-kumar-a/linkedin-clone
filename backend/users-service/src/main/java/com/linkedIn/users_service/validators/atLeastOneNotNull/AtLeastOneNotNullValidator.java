package com.linkedIn.users_service.validators.atLeastOneNotNull;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;

public class AtLeastOneNotNullValidator 
    implements ConstraintValidator<AtLeastOneNotNull, Object> {

    @Override
    public void initialize(AtLeastOneNotNull constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {
        if (object == null) {
            return true;
        }
        
        for (Field field : object.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                if (field.get(object) != null) {
                    return true;
                }
            } catch (IllegalAccessException e) {
                return false;
            }
        }
        return false;
    }
}
