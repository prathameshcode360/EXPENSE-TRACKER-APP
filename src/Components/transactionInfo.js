function TransactionInfo({ balance, income, expense }) {
  return (
    <div className="transaction-info">
      {/* Balance Section */}
      <div className="balance">
        <h2>Your-Balance:{balance}</h2>
      </div>

      {/* Income and Expense Section */}
      <div className="income-expense">
        {/* Income */}
        <div className="income">
          <h3>Income:{income}</h3>
        </div>

        {/* Expense */}
        <div className="Expense">
          <h3>Expense:{expense}</h3>
        </div>
      </div>
    </div>
  );
}

export default TransactionInfo;
