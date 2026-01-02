function TransactionList(props) {
  // Props destructuring
  const { transactionData, updateTransaction, deleteTransaction } = props;

  return (
    <>
      <div className="transaction-list">
        {/* Loop through all transactions */}
        {transactionData.map((transaction, index) => (
          <div className="transaction" key={index}>
            <h3>{transaction.title}</h3>
            <h4>{transaction.amount} Rs</h4>
            {/* Action buttons */}
            <div className="actions">
              {/* Delete transaction */}
              <img
                onClick={() => deleteTransaction(index)}
                src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                alt="delete"
              />

              {/* Update transaction */}
              <img
                onClick={() => updateTransaction(index)}
                src="https://cdn-icons-png.flaticon.com/128/18094/18094524.png"
                alt="update"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TransactionList;
