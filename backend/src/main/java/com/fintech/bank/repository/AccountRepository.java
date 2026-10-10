package com.fintech.bank.repository;

import com.fintech.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByCustomerId(Long customerId);
    boolean existsByAccountNumber(String accountNumber);

    @Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.active = true")
    BigDecimal sumTotalBalance();
}
