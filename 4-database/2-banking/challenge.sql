/*
    Challenge: Implement a Secure Fund Transfer Function

    In this challenge, you will implement a PostgreSQL stored function to simulate transferring funds 
    between two accounts in a banking system. The function must follow proper validation, ensure data 
    integrity, and log transactions with a shared reference.

    Your function should be named:
    banking.transfer_funds(from_id INT, to_id INT, amount NUMERIC)

    The function must:

    - Prevent transfers to the same account
    - Ensure the transfer amount is greater than zero
    - Validate that both sender and recipient accounts exist
    - Prevent transfers if either account is marked as "frozen"
    - Ensure the sender has sufficient funds
    - Debit the sender and credit the recipient atomically
    - Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
    - Raise meaningful exceptions for all validation failures

    The function should perform all operations within a safe transactional context, maintaining 
    database consistency even in the event of failure.

    Notes:
    - In order to test you can mock some additional data in the tables that participates in this challenge.
    - Make sure of raising errors when they're present

    ERD:
    +---------------------+            +--------------------------+
    |     accounts        |            |      transactions        |
    +---------------------+            +--------------------------+
    | account_id (PK)     |<-----------| transaction_id (PK)      |
    | balance             |            | account_id (FK)          |
    | status              |            | amount                   |
    +---------------------+            | transaction_type         |
                                       | reference                |
                                       | transaction_date         |
                                       +--------------------------+
*/


-- your solution here

CREATE OR REPLACE FUNCTION banking.transfer_funds(
  from_id INT,
  to_id INT,
  amount NUMERIC
) RETURNS TEXT
LANGUAGE plpgsql
AS
$$
DECLARE
  sender_balance NUMERIC(12, 2);
  sender_status TEXT;
  recipient_status TEXT;
  transfer_uuid_reference UUID := uuid_generate_v4();
BEGIN
  -- Prevent transfers to the same account
  IF from_id = to_id THEN
    raise exception 'Transfers to the same account are not allowed.';
  END IF;

  -- Ensure the transfer amount is greater than zero
  IF amount <= 0 THEN
    raise exception 'The transfer amount must be greater than zero.';
  END IF;

  -- Validate that both sender and recipient accounts exist
  SELECT balance, status FROM banking.accounts
  INTO sender_balance, sender_status
  WHERE account_id = from_id;

  IF NOT FOUND THEN
    raise exception 'Sender account with id % does not exist.',
      from_id;
  END IF;

  SELECT status FROM banking.accounts
  INTO recipient_status
  WHERE account_id = to_id;

  IF NOT FOUND THEN
    raise exception 'Recipient account with id % does not exist.',
      to_id;
  END IF;

  -- Prevent transfers if either account is marked as "frozen"
  IF sender_status = 'frozen' THEN
    raise exception 'Sender account is frozen, cannot perform transfer.';
  ELSIF recipient_status = 'frozen' THEN
    raise exception 'Recipient account is frozen and cannot receive transfers.';
  END IF;

  -- Ensure the sender has sufficient funds
  IF sender_balance < amount THEN
    raise exception 'Sender account does not have sufficient funds.';
  END IF;

  -- Debit the sender and credit the recipient atomically
  UPDATE banking.accounts
  SET balance = balance - amount
  WHERE account_id = from_id;

  UPDATE banking.accounts
  SET balance = balance + amount
  WHERE account_id = to_id;

  -- Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
  INSERT INTO banking.transactions(account_id, amount, transaction_type, reference)
  values
    (from_id, amount, 'withdrawal', transfer_uuid_reference::TEXT),
    (to_id, amount, 'deposit', transfer_uuid_reference::TEXT);
  
  raise info 'Processed withdrawal of amount % from user % with reference %',
    amount, from_id, transfer_uuid_reference;
  raise info 'Processed deposit of amount % to user % with reference %',
    amount, to_id, transfer_uuid_reference;

  RETURN 'Transaction completed successfully!';
END;
$$;


-- RUNNING SOME TESTS:

-- Prevent transfers to the same account: SHOULD RAISE ERROR
SELECT banking.transfer_funds(1, 1, 100);
SELECT banking.transfer_funds(2, 2, 100);

-- Ensure the transfer amount is greater than zero: SHOULD RAISE ERROR
SELECT banking.transfer_funds(1, 2, -200);
SELECT banking.transfer_funds(2, 1, 0);

-- Validate that both sender and recipient accounts exist: SHOULD RAISE ERROR
SELECT banking.transfer_funds(99, 1, 100);
SELECT banking.transfer_funds(1, 99, 100);
SELECT banking.transfer_funds(99, 100, 100);

-- Prevent transfers if either account is marked as "frozen": SHOULD RAISE ERROR
SELECT banking.transfer_funds(1, 3, 100);
SELECT banking.transfer_funds(3, 1, 100);

-- Ensure the sender has sufficient funds: SHOULD RAISE ERROR
SELECT banking.transfer_funds(1, 2, 9999999999);

-- Perform transaction if everything is in order: SHOULD WORK
SELECT banking.transfer_funds(1, 2, 100);
SELECT * FROM banking.transactions;
