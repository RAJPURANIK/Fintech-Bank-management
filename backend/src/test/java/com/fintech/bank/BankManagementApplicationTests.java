package com.fintech.bank;

import com.fintech.bank.dto.CreateAccountRequest;
import com.fintech.bank.dto.TransactionRequest;
import com.fintech.bank.exception.InsufficientBalanceException;
import com.fintech.bank.model.Account;
import com.fintech.bank.model.AccountType;
import com.fintech.bank.model.Customer;
import com.fintech.bank.model.Transaction;
import com.fintech.bank.model.TransactionType;
import com.fintech.bank.repository.AccountRepository;
import com.fintech.bank.repository.CustomerRepository;
import com.fintech.bank.repository.TransactionRepository;
import com.fintech.bank.service.AccountService;
import com.fintech.bank.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BankManagementApplicationTests {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private Customer sampleCustomer;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        customerRepository.deleteAll();

        Customer c = new Customer("John", "Doe", "john.doe@test.com", "+1-555-0100", "123 Financial Way");
        sampleCustomer = customerService.createCustomer(c);
    }

    @Test
    @DisplayName("Should create customer successfully")
    void testCreateCustomer() {
        assertNotNull(sampleCustomer.getId());
        assertEquals("John", sampleCustomer.getFirstName());
        assertEquals("john.doe@test.com", sampleCustomer.getEmail());
    }

    @Test
    @DisplayName("Should create savings account with initial deposit")
    void testCreateAccount() {
        CreateAccountRequest req = new CreateAccountRequest(sampleCustomer.getId(), AccountType.SAVINGS, new BigDecimal("500.00"));
        Account account = accountService.createAccount(req);

        assertNotNull(account.getId());
        assertTrue(account.getAccountNumber().startsWith("FTBK"));
        assertEquals(0, new BigDecimal("500.00").compareTo(account.getBalance()));
        assertEquals(AccountType.SAVINGS, account.getAccountType());

        // Initial deposit transaction should be created
        List<Transaction> txs = accountService.getTransactionsByAccount(account.getId());
        assertEquals(1, txs.size());
        assertEquals(TransactionType.DEPOSIT, txs.get(0).getType());
        assertEquals(0, new BigDecimal("500.00").compareTo(txs.get(0).getAmount()));
    }

    @Test
    @DisplayName("Should deposit funds and update balance correctly")
    void testDepositFunds() {
        CreateAccountRequest req = new CreateAccountRequest(sampleCustomer.getId(), AccountType.CURRENT, new BigDecimal("100.00"));
        Account account = accountService.createAccount(req);

        Transaction tx = accountService.deposit(account.getId(), new TransactionRequest(new BigDecimal("250.50"), "Direct salary credit"));
        assertEquals(0, new BigDecimal("350.50").compareTo(tx.getBalanceAfter()));

        Account updated = accountService.getAccountById(account.getId());
        assertEquals(0, new BigDecimal("350.50").compareTo(updated.getBalance()));
    }

    @Test
    @DisplayName("Should withdraw funds successfully when balance is sufficient")
    void testWithdrawFunds() {
        CreateAccountRequest req = new CreateAccountRequest(sampleCustomer.getId(), AccountType.SAVINGS, new BigDecimal("1000.00"));
        Account account = accountService.createAccount(req);

        Transaction tx = accountService.withdraw(account.getId(), new TransactionRequest(new BigDecimal("400.00"), "ATM withdrawal"));
        assertEquals(0, new BigDecimal("600.00").compareTo(tx.getBalanceAfter()));

        Account updated = accountService.getAccountById(account.getId());
        assertEquals(0, new BigDecimal("600.00").compareTo(updated.getBalance()));
    }

    @Test
    @DisplayName("Should throw InsufficientBalanceException and prevent overdraft when withdrawing more than balance")
    void testInsufficientBalanceProtection() {
        CreateAccountRequest req = new CreateAccountRequest(sampleCustomer.getId(), AccountType.SAVINGS, new BigDecimal("150.00"));
        Account account = accountService.createAccount(req);

        assertThrows(InsufficientBalanceException.class, () -> {
            accountService.withdraw(account.getId(), new TransactionRequest(new BigDecimal("200.00"), "Attempted overdraft"));
        });

        // Balance remains intact
        Account updated = accountService.getAccountById(account.getId());
        assertEquals(0, new BigDecimal("150.00").compareTo(updated.getBalance()));
    }

    @Test
    @DisplayName("Dashboard summary should aggregate counts and balances correctly")
    void testDashboardSummary() {
        CreateAccountRequest req1 = new CreateAccountRequest(sampleCustomer.getId(), AccountType.SAVINGS, new BigDecimal("300.00"));
        CreateAccountRequest req2 = new CreateAccountRequest(sampleCustomer.getId(), AccountType.CURRENT, new BigDecimal("700.00"));
        accountService.createAccount(req1);
        accountService.createAccount(req2);

        var summary = accountService.getDashboardSummary();
        assertEquals(1, summary.getCustomerCount());
        assertEquals(2, summary.getAccountCount());
        assertEquals(0, new BigDecimal("1000.00").compareTo(summary.getTotalBalance()));
        assertEquals(2, summary.getRecentTransactions().size());
    }
}
