package com.fintech.bank.controller;

import com.fintech.bank.dto.CreateAccountRequest;
import com.fintech.bank.dto.TransactionRequest;
import com.fintech.bank.model.Account;
import com.fintech.bank.model.Transaction;
import com.fintech.bank.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts(@RequestParam(required = false) Long customerId) {
        if (customerId != null) {
            return ResponseEntity.ok(accountService.getAccountsByCustomerId(customerId));
        }
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        Account created = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<Transaction> deposit(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        Transaction tx = accountService.deposit(id, request);
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Transaction> withdraw(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        Transaction tx = accountService.withdraw(id, request);
        return ResponseEntity.ok(tx);
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getTransactionsByAccount(id));
    }
}
