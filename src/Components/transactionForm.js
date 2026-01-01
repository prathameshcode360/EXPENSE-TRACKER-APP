import { useState } from "react";
import TransactionInfo from "./transactionInfo";
import TransactionList from "./transactionList";

function TransactionForm() {
  const [transaction, setTransaction] = useState({ title: "", amount: 0 });
  const [trasactionData, setTransactionData] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    setTransactionData((prevData) => [
      { title: transaction.title, amount: transaction.amount },
      ...prevData,
    ]);

    setTransaction({ title: "", amount: 0 });
  }

  return (
    <>
      <div className="left-section">
        <h2>Add New Transaction</h2>
        <form className="transaction-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Title"
            required
            value={transaction.title}
            onChange={(e) =>
              setTransaction({
                title: e.target.value,
                amount: transaction.amount,
              })
            }
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="Enter Amount"
            required
            value={transaction.amount}
            onChange={(e) =>
              setTransaction({
                title: transaction.title,
                amount: e.target.value,
              })
            }
          />
          <button type="submit">Add Transaction</button>
        </form>
      </div>
      <div className="right-section">
        <TransactionInfo trasactionData={trasactionData} />
        <TransactionList trasactionData={trasactionData} />
      </div>
    </>
  );
}
export default TransactionForm;
