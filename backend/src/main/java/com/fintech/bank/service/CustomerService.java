package com.fintech.bank.service;

import com.fintech.bank.exception.BusinessException;
import com.fintech.bank.exception.ResourceNotFoundException;
import com.fintech.bank.model.Customer;
import com.fintech.bank.repository.AccountRepository;
import com.fintech.bank.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    public CustomerService(CustomerRepository customerRepository, AccountRepository accountRepository) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public Customer createCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new BusinessException("Customer with email '" + customer.getEmail() + "' already exists");
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        Customer customer = getCustomerById(id);
        if (!customer.getEmail().equalsIgnoreCase(updated.getEmail()) && customerRepository.existsByEmail(updated.getEmail())) {
            throw new BusinessException("Email '" + updated.getEmail() + "' is already in use by another customer");
        }
        customer.setFirstName(updated.getFirstName());
        customer.setLastName(updated.getLastName());
        customer.setEmail(updated.getEmail());
        customer.setPhone(updated.getPhone());
        customer.setAddress(updated.getAddress());
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        if (!accountRepository.findByCustomerId(id).isEmpty()) {
            throw new BusinessException("Cannot delete customer with existing bank accounts. Close or remove accounts first.");
        }
        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    public long getCustomerCount() {
        return customerRepository.count();
    }
}
