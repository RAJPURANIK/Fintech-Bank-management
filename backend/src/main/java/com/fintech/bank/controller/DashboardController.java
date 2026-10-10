package com.fintech.bank.controller;

import com.fintech.bank.dto.DashboardSummary;
import com.fintech.bank.model.Transaction;
import com.fintech.bank.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final AccountService accountService;

    public DashboardController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        return ResponseEntity.ok(accountService.getDashboardSummary());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getRecentTransactions(@RequestParam(defaultValue = "15") int limit) {
        return ResponseEntity.ok(accountService.getAllRecentTransactions(limit));
    }
}
