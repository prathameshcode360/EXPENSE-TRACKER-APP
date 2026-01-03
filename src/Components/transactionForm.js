import { useState } from "react";
import TransactionInfo from "./transactionInfo";
import TransactionList from "./transactionList";
import { db } from "../Firebase/firebaseInit";
import { collection, addDoc } from "firebase/firestore";

function TransactionForm() {
  // State for current input transaction
  const [transaction, setTransaction] = useState({ title: "", amount: 0 });

  // State for all transactions
  const [transactionData, setTransactionData] = useState([]);

  // Balance related states
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // Used to identify update mode
  const [updateIndex, setUpdateIndex] = useState(null);

  // HANDLE SUBMIT (ADD / UPDATE)
  async function handleSubmit(event) {
    event.preventDefault();

    const newAmount = Number(transaction.amount);

    // -------- UPDATE TRANSACTION --------
    if (updateIndex !== null) {
      const updated = [...transactionData];

      const oldAmount = Number(updated[updateIndex].amount);
      const diff = newAmount - oldAmount;

      // Prevent negative balance after update
      if (balance + diff < 0) {
        alert("You cannot spend more than your income!!");
        setTransaction({ title: "", amount: 0 });
        return;
      }

      // Update transaction
      updated[updateIndex] = { ...transaction };
      setTransactionData(updated);

      // Update balance using difference
      setBalance((prev) => prev + diff);

      // Remove old amount
      if (oldAmount > 0) {
        setIncome((prev) => prev - oldAmount);
      } else {
        setExpense((prev) => prev - Math.abs(oldAmount));
      }

      // Add new amount
      if (newAmount > 0) {
        setIncome((prev) => prev + newAmount);
      } else {
        setExpense((prev) => prev + Math.abs(newAmount));
      }

      // Reset update mode
      setUpdateIndex(null);
      setTransaction({ title: "", amount: 0 });
    }

    // ADD NEW TRANSACTION
    else {
      // Prevent negative balance
      if (newAmount < 0 && balance + newAmount < 0) {
        alert("You have not enough balance please add cash !!");
        return;
      }

      // Update balance
      setBalance((prev) => prev + newAmount);

      // Update income or expense
      if (newAmount > 0) {
        setIncome((prev) => prev + newAmount);
      } else {
        setExpense((prev) => prev + Math.abs(newAmount));
      }

      // Add transaction to list
      setTransactionData((prevData) => [
        { title: transaction.title, amount: newAmount },
        ...prevData,
      ]);

      // Reset input fields
      setTransaction({ title: "", amount: 0 });

      //add to firebase
      await addDoc(collection(db, "transactions"), {
        title: transaction.title,
        amount: Number(transaction.amount),
      });
    }
  }

  // UPDATE TRANSACTION
  function updateTransaction(index) {
    const selectedTransaction = transactionData[index];

    // Load selected transaction into input
    setTransaction({
      title: selectedTransaction.title,
      amount: selectedTransaction.amount,
    });

    setUpdateIndex(index);
  }

  // DELETE TRANSACTION
  function deleteTransaction(index) {
    const toDeleteTransaction = transactionData[index];
    const deleteAmount = Number(toDeleteTransaction.amount);

    // Prevent negative balance after delete
    if (balance - deleteAmount < 0) {
      alert(
        "Cannot delete this transaction! It will result in negative balance."
      );
      return;
    }

    // Remove transaction
    const updatedData = transactionData.filter((_, i) => i !== index);
    setTransactionData(updatedData);

    // Update balance
    setBalance((prev) => prev - deleteAmount);

    // Update income or expense
    if (deleteAmount > 0) {
      setIncome((prev) => prev - deleteAmount);
    } else {
      setExpense((prev) => prev - Math.abs(deleteAmount));
    }
  }

  // UI
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

          <button type="submit">
            {updateIndex !== null ? "Update" : "Add"}
          </button>
        </form>
      </div>

      <div className="right-section">
        <TransactionInfo balance={balance} income={income} expense={expense} />

        <TransactionList
          transactionData={transactionData}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
        />
      </div>
    </>
  );
}

export default TransactionForm;
