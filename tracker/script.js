const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const expenseChartCanvas = document.getElementById('expenseChart');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

let chart;

function updateUI() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeVal = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expenseVal = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeVal}`;
  expense.innerText = `₹${expenseVal}`;

  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);

  updateChart();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = `${transaction.text} (${transaction.category}) <span>${sign}₹${Math.abs(transaction.amount)}</span>
  <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;
  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please fill out all fields');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  text.value = '';
  amount.value = '';
  category.value = '';

  updateUI();
});

function updateChart() {
  const expenseCategories = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
  });

  const labels = Object.keys(expenseCategories);
  const data = Object.values(expenseCategories);

  if (chart) chart.destroy();
  chart = new Chart(expenseChartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
      }]
    }
  });
}

// Initial UI update
updateUI();
