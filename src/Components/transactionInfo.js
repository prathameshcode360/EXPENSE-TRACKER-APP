function TransactionInfo({ balance, income, expense }) {
  return (
    <div className="transaction-info">
      <div className="balance">
        <h2>Your-Balance:{balance}</h2>
      </div>
      <div className="income-expense">
        <div className="income">
          <h3>Income:{income}</h3>
        </div>
        <div className="Expense">
          <h3>Expense:{expense}</h3>
        </div>
      </div>
    </div>
  );
}
export default TransactionInfo;
