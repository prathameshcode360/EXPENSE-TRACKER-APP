import { useReducer, useState } from "react";
import TransactionInfo from "./transactionInfo";
import TransactionList from "./transactionList";

//  REDUCER FUNCTION
function reducerFunction(state, action) {
  switch (action.type) {
    case "ADD":
      // Add new transaction at top
      return [action.payload, ...state];

    case "DELETE":
      // Remove transaction by index
      return state.filter((_, index) => index !== action.index);

    case "UPDATE":
      // Update transaction at given index
      return state.map((item, index) =>
        index === action.index ? action.payload : item
      );

    default:
      return state;
  }
}

function TransactionForm() {
  const [transaction, setTransaction] = useState({
    title: "",
    amount: 0,
  });
  const [transactionData, dispatch] = useReducer(reducerFunction, []);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [updateIndex, setUpdateIndex] = useState(null);

  //  HANDLE SUBMIT (ADD / UPDATE)
  function handleSubmit(event) {
    event.preventDefault();

    const newAmount = Number(transaction.amount);

    // UPDATE EXISTING TRANSACTION
    if (updateIndex !== null) {
      const oldAmount = Number(transactionData[updateIndex].amount);
      const diff = newAmount - oldAmount;

      // Prevent negative balance
      if (balance + diff < 0) {
        alert("You cannot spend more than your income!!");
        setTransaction({ title: "", amount: 0 });
        return;
      }

      // Update transaction using reducer
      dispatch({
        type: "UPDATE",
        index: updateIndex,
        payload: { title: transaction.title, amount: newAmount },
      });

      // Update balance
      setBalance((prev) => prev + diff);

      // Remove old income/expense
      if (oldAmount > 0) {
        setIncome((prev) => prev - oldAmount);
      } else {
        setExpense((prev) => prev - Math.abs(oldAmount));
      }

      // Add new income/expense
      if (newAmount > 0) {
        setIncome((prev) => prev + newAmount);
      } else {
        setExpense((prev) => prev + Math.abs(newAmount));
      }

      // Reset update mode
      setUpdateIndex(null);
      setTransaction({ title: "", amount: 0 });
    } else {
      // ADD NEW TRANSACTION
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

      // Add transaction using reducer
      dispatch({
        type: "ADD",
        payload: {
          title: transaction.title,
          amount: transaction.amount,
        },
      });

      // Reset form
      setTransaction({ title: "", amount: 0 });
    }
  }

  // Update load transaction
  function updateTransaction(index) {
    const selectedTransaction = transactionData[index];

    setTransaction({
      title: selectedTransaction.title,
      amount: selectedTransaction.amount,
    });

    setUpdateIndex(index);
  }

  // Delete Transaction
  function deleteTransaction(index) {
    const toDeleteTransaction = transactionData[index];
    const deleteAmount = Number(toDeleteTransaction.amount);

    // Prevent negative balance
    if (balance - deleteAmount < 0) {
      alert(
        "Cannot delete this transaction! It will result in negative balance."
      );
      return;
    }

    // Delete using reducer
    dispatch({
      type: "DELETE",
      index: index,
    });

    // Update balance
    setBalance((prev) => prev - deleteAmount);

    // Update income or expense
    if (deleteAmount > 0) {
      setIncome((prev) => prev - deleteAmount);
    } else {
      setExpense((prev) => prev - Math.abs(deleteAmount));
    }
  }

  //UI
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
