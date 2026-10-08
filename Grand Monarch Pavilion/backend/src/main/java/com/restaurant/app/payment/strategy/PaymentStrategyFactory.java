package com.restaurant.app.payment.strategy;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Factory & Registry to retrieve the appropriate PaymentStrategy at runtime.
 * Enables interchangeable algorithm execution without long if-else / switch chains.
 */
@Component
public class PaymentStrategyFactory {

    private final Map<String, PaymentStrategy> strategies;
    private final CashPaymentStrategy defaultStrategy;

    public PaymentStrategyFactory(List<PaymentStrategy> strategyList, CashPaymentStrategy defaultStrategy) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(s -> s.getPaymentType().toUpperCase(), s -> s, (s1, s2) -> s1));
        this.defaultStrategy = defaultStrategy;
    }

    public PaymentStrategy getStrategy(String paymentMethod) {
        if (paymentMethod == null) {
            return defaultStrategy;
        }
        String normalized = paymentMethod.trim().toUpperCase();
        if (normalized.contains("CARD") || normalized.contains("POS") || normalized.contains("ONLINE")) {
            return strategies.getOrDefault("CREDIT_CARD", defaultStrategy);
        } else if (normalized.contains("BANK") || normalized.contains("TRANSFER") || normalized.contains("CHEQUE")) {
            return strategies.getOrDefault("BANK_TRANSFER", defaultStrategy);
        } else {
            return strategies.getOrDefault("CASH", defaultStrategy);
        }
    }
}
