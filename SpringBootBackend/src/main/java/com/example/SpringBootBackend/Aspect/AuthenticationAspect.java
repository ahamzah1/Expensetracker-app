package com.example.SpringBootBackend.Aspect;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.aspectj.lang.reflect.MethodSignature;
import java.lang.reflect.Parameter;

@Aspect
@Configuration
public class AuthenticationAspect {

    private final Logger logger = LoggerFactory.getLogger(AuthenticationAspect.class);

    @Pointcut("execution(* com.example.SpringBootBackend.Expense.ExpenseController..*(..))")
    public void expenseController(){}

    @Around("expenseController()")
    public Object handleAuthentication(ProceedingJoinPoint joinPoint) throws Throwable{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized access attempt to: " + joinPoint.getSignature());
            throw new SecurityException("User is not authenticated!");
        }

        Object userDetails = authentication.getPrincipal();
        logger.info("Authenticated User: " + userDetails.toString());

        Object[] args = joinPoint.getArgs();
        Parameter[] parameters = ((MethodSignature) joinPoint.getSignature()).getMethod().getParameters();

        for (int i = 0; i < parameters.length; i++) {
            if (parameters[i].getType().isAssignableFrom(userDetails.getClass())) {
                args[i] = userDetails; // Inject authenticated user
            }
        }

        return joinPoint.proceed(args);

    }
}
