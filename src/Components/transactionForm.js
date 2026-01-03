import { useEffect, useState } from "react";
import TransactionInfo from "./transactionInfo";
import TransactionList from "./transactionList";
import { db } from "../Firebase/firebaseInit";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function TransactionForm() {
  const [transaction, setTransaction] = useState({ title: "", amount: 0 });
  const [transactionData, setTransactionData] = useState([]);

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [updateIndex, setUpdateIndex] = useState(null);

  //  FIRESTORE SUMMARY UPDATE
  async function updateSummary(balance, income, expense) {
    const summaryRef = doc(db, "transactionInfo", "summary");
    await setDoc(summaryRef, { balance, income, expense });
  }

  // / FETCH TRANSACTIONS (REAL TIME)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactionData(transactions);
    });

    return () => unsub();
  }, []);

  //  FETCH SUMMARY (REAL TIME)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "transactionInfo", "summary"),
      (docSnap) => {
        if (docSnap.exists()) {
          const { balance, income, expense } = docSnap.data();
          setBalance(balance);
          setIncome(income);
          setExpense(expense);
        }
      }
    );

    return () => unsub();
  }, []);

  //  ADD / UPDATE TRANSACTION
  async function handleSubmit(event) {
    event.preventDefault();
    const newAmount = Number(transaction.amount);

    //  UPDATE
    if (updateIndex !== null) {
      const oldTransaction = transactionData[updateIndex];
      const oldAmount = Number(oldTransaction.amount);
      const diff = newAmount - oldAmount;

      if (balance + diff < 0) {
        alert("You cannot spend more than your income!!");
        return;
      }

      const updatedBalance = balance + diff;
      let updatedIncome = income;
      let updatedExpense = expense;

      if (oldAmount > 0) updatedIncome -= oldAmount;
      else updatedExpense -= Math.abs(oldAmount);

      if (newAmount > 0) updatedIncome += newAmount;
      else updatedExpense += Math.abs(newAmount);

      await updateDoc(doc(db, "transactions", oldTransaction.id), {
        title: transaction.title,
        amount: newAmount,
      });

      await updateSummary(updatedBalance, updatedIncome, updatedExpense);

      setUpdateIndex(null);
      setTransaction({ title: "", amount: 0 });
    } else {
      // ADD
      if (newAmount < 0 && balance + newAmount < 0) {
        alert("You have not enough balance please add cash !!");
        return;
      }

      const updatedBalance = balance + newAmount;
      let updatedIncome = income;
      let updatedExpense = expense;

      if (newAmount > 0) updatedIncome += newAmount;
      else updatedExpense += Math.abs(newAmount);

      await addDoc(collection(db, "transactions"), {
        title: transaction.title,
        amount: newAmount,
      });

      await updateSummary(updatedBalance, updatedIncome, updatedExpense);

      setTransaction({ title: "", amount: 0 });
    }
  }

  //  UPDATE TRANSACTION
  function updateTransaction(index) {
    const selected = transactionData[index];
    setTransaction({
      title: selected.title,
      amount: selected.amount,
    });
    setUpdateIndex(index);
  }

  //  DELETE TRANSACTION
  async function deleteTransaction(index) {
    const toDelete = transactionData[index];
    const deleteAmount = Number(toDelete.amount);

    if (balance - deleteAmount < 0) {
      alert(
        "Cannot delete this transaction! It will result in negative balance."
      );
      return;
    }

    const updatedBalance = balance - deleteAmount;
    let updatedIncome = income;
    let updatedExpense = expense;

    if (deleteAmount > 0) updatedIncome -= deleteAmount;
    else updatedExpense -= Math.abs(deleteAmount);

    await deleteDoc(doc(db, "transactions", toDelete.id));
    await updateSummary(updatedBalance, updatedIncome, updatedExpense);
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
            required
            value={transaction.amount}
            onChange={(e) =>
              setTransaction({
                title: transaction.title,
                amount: e.target.value,
              })
            }
          />
          <p>while adding expense use "-" before amount</p>
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
