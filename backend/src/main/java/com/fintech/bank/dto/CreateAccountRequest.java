package com.fintech.bank.dto;

import com.fintech.bank.model.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CreateAccountRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Account type is required (SAVINGS or CURRENT)")
    private AccountType accountType;

    @DecimalMin(value = "0.00", message = "Initial deposit cannot be negative")
    private BigDecimal initialDeposit = BigDecimal.ZERO;

    public CreateAccountRequest() {}

    public CreateAccountRequest(Long customerId, AccountType accountType, BigDecimal initialDeposit) {
        this.customerId = customerId;
        this.accountType = accountType;
        this.initialDeposit = initialDeposit;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getInitialDeposit() {
        return initialDeposit;
    }

    public void setInitialDeposit(BigDecimal initialDeposit) {
        this.initialDeposit = initialDeposit;
    }
}
