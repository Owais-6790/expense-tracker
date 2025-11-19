const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction(event) {
  event.preventDefault();

  let description = descriptionEl.value.trim();
  let amount = Number(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedtransaction = [...transactions].reverse();

  for (let i = 0; i < sortedtransaction.length; i++) {
    const transactionEl = createTransactionElement(sortedtransaction[i]);
    transactionListEl.appendChild(transactionEl);
  }
}

function createTransactionElement(data) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  if (data.amount > 0) {
    li.classList.add("income");
  } else {
    li.classList.add("expense");
  }

  li.innerHTML = `
    <span>${data.description}</span>
    <span>
  
    ${formatCurrency(data.amount)}
      <button class="delete-btn" onclick="removeTransaction(${
        data.id
      })">x</button>
    </span>
  `;

  return li;
}

function updateSummary() {
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("PKR", {
    style: "currency",
    currency: "pkr",
  }).format(number);
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

updateTransactionList();
updateSummary();
