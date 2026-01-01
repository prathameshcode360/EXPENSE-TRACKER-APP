function TransactionList(props) {
  const { trasactionData } = props;
  return (
    <>
      <div className="transaction-list">
        {trasactionData.map((transaction, index) => (
          <div className="transaction" key={index}>
            <h3>{transaction.title}</h3>
            <h4>{transaction.amount}Rs</h4>
            <div className="actions">
              <img
                src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                alt="delete-"
              />
              <img
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
