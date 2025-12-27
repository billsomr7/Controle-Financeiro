const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const filterType = document.getElementById('filter-type');

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');

const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];



function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}



function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'entrada')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'saida')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    totalIncomeEl.textContent = formatCurrency(income);
    totalExpenseEl.textContent = formatCurrency(expense);
    balanceEl.textContent = formatCurrency(balance);
}



function renderTransactions() {
    list.innerHTML = '';

    const filteredTransactions = transactions.filter(t => {
        if (filterType.value === 'todos') return true;
        return t.type === filterType.value;
    });

    filteredTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction', transaction.type);

        li.innerHTML = `
            <div>
                <strong>${transaction.description}</strong>
                <small>${transaction.category} • ${transaction.date}</small>
            </div>
            <div>
                <span>${formatCurrency(transaction.amount)}</span>
                <br>
                <button>Excluir</button>
            </div>
        `;

        li.querySelector('button').addEventListener('click', () => {
            const confirmDelete = confirm('Deseja realmente excluir esta movimentação?');
            if (!confirmDelete) return;

            transactions = transactions.filter(t => t.id !== transaction.id);
            saveTransactions();
            updateUI();
        });

        list.appendChild(li);
    });
}



function updateUI() {
    renderTransactions();
    updateSummary();
}



form.addEventListener('submit', event => {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if (!description || amount <= 0) {
        alert('Preencha a descrição e um valor maior que zero.');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type: typeSelect.value,
        category: categorySelect.value,
        date: new Date().toLocaleDateString('pt-BR')
    };

    transactions.push(transaction);
    saveTransactions();
    updateUI();
    form.reset();
});

filterType.addEventListener('change', renderTransactions);



updateUI();
