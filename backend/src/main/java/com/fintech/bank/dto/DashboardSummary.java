package com.fintech.bank.dto;

import com.fintech.bank.model.Transaction;
import java.math.BigDecimal;
import java.util.List;

public class DashboardSummary {
    private long customerCount;
    private long accountCount;
    private BigDecimal totalBalance;
    private List<Transaction> recentTransactions;

    public DashboardSummary() {}

    public DashboardSummary(long customerCount, long accountCount, BigDecimal totalBalance, List<Transaction> recentTransactions) {
        this.customerCount = customerCount;
        this.accountCount = accountCount;
        this.totalBalance = totalBalance;
        this.recentTransactions = recentTransactions;
    }

    public long getCustomerCount() {
        return customerCount;
    }

    public void setCustomerCount(long customerCount) {
        this.customerCount = customerCount;
    }

    public long getAccountCount() {
        return accountCount;
    }

    public void setAccountCount(long accountCount) {
        this.accountCount = accountCount;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public List<Transaction> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<Transaction> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
