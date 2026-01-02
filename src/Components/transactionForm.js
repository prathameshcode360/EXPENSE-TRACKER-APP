import { useState } from "react";
import TransactionInfo from "./transactionInfo";
import TransactionList from "./transactionList";

function TransactionForm() {
  const [transaction, setTransaction] = useState({ title: "", amount: 0 });
  const [trasactionData, setTransactionData] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();

    const newAmount = parseFloat(transaction.amount);
    if (newAmount < 0 && balance + newAmount < 0) {
      alert("You have not enough balance please add cash !!");
      return;
    }

    setBalance((prev) => prev + newAmount);
    if (newAmount > 0) {
      setIncome((prev) => prev + newAmount);
    } else {
      setExpense((prev) => prev + Math.abs(newAmount));
    }

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
        <TransactionInfo balance={balance} income={income} expense={expense} />
        <TransactionList trasactionData={trasactionData} />
      </div>
    </>
  );
}
export default TransactionForm;
