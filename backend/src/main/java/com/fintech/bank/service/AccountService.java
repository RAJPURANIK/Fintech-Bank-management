package com.fintech.bank.service;

import com.fintech.bank.dto.CreateAccountRequest;
import com.fintech.bank.dto.DashboardSummary;
import com.fintech.bank.dto.TransactionRequest;
import com.fintech.bank.exception.BusinessException;
import com.fintech.bank.exception.InsufficientBalanceException;
import com.fintech.bank.exception.ResourceNotFoundException;
import com.fintech.bank.model.Account;
import com.fintech.bank.model.Customer;
import com.fintech.bank.model.Transaction;
import com.fintech.bank.model.TransactionType;
import com.fintech.bank.repository.AccountRepository;
import com.fintech.bank.repository.CustomerRepository;
import com.fintech.bank.repository.TransactionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final SecureRandom random = new SecureRandom();

    public AccountService(AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));
    }

    @Transactional(readOnly = true)
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    public Account createAccount(CreateAccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        String accountNumber = generateUniqueAccountNumber();
        BigDecimal initialDeposit = request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO;

        if (initialDeposit.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Initial deposit cannot be negative");
        }

        Account account = new Account(accountNumber, request.getAccountType(), initialDeposit, customer);
        Account savedAccount = accountRepository.save(account);

        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            Transaction initialTx = new Transaction(
                    savedAccount,
                    TransactionType.DEPOSIT,
                    initialDeposit,
                    initialDeposit,
                    "Initial account opening deposit"
            );
            transactionRepository.save(initialTx);
        }

        return savedAccount;
    }

    public Transaction deposit(Long accountId, TransactionRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Deposit amount must be strictly greater than 0");
        }

        Account account = getAccountById(accountId);
        if (!account.isActive()) {
            throw new BusinessException("Account is closed/inactive");
        }

        BigDecimal updatedBalance = account.getBalance().add(request.getAmount());
        account.setBalance(updatedBalance);
        accountRepository.save(account);

        String desc = request.getDescription() != null && !request.getDescription().isBlank()
                ? request.getDescription()
                : "Funds deposited";

        Transaction tx = new Transaction(account, TransactionType.DEPOSIT, request.getAmount(), updatedBalance, desc);
        return transactionRepository.save(tx);
    }

    public Transaction withdraw(Long accountId, TransactionRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Withdrawal amount must be strictly greater than 0");
        }

        Account account = getAccountById(accountId);
        if (!account.isActive()) {
            throw new BusinessException("Account is closed/inactive");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds. Current balance: $" + account.getBalance()
                    + ", requested withdrawal: $" + request.getAmount());
        }

        BigDecimal updatedBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(updatedBalance);
        accountRepository.save(account);

        String desc = request.getDescription() != null && !request.getDescription().isBlank()
                ? request.getDescription()
                : "Funds withdrawn";

        Transaction tx = new Transaction(account, TransactionType.WITHDRAWAL, request.getAmount(), updatedBalance, desc);
        return transactionRepository.save(tx);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByAccount(Long accountId) {
        // verify existence
        getAccountById(accountId);
        return transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getAllRecentTransactions(int limit) {
        return transactionRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, limit));
    }

    @Transactional(readOnly = true)
    public DashboardSummary getDashboardSummary() {
        long customerCount = customerRepository.count();
        long accountCount = accountRepository.count();
        BigDecimal totalBalance = accountRepository.sumTotalBalance();
        List<Transaction> recent = transactionRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, 10));

        return new DashboardSummary(customerCount, accountCount, totalBalance != null ? totalBalance : BigDecimal.ZERO, recent);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long number = 1000000000L + (long)(random.nextDouble() * 8999999999L);
            accountNumber = "FTBK" + number;
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
