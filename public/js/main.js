// 🌟 Main Client-side JavaScript

// 🎯 Global Variables
let selectedDrink = null;
let selectedQuantity = 1;

// 🔄 DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');
const drinksContainer = document.getElementById('drinksContainer');
const countModal = new bootstrap.Modal(document.getElementById('countModal'));
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));

// 📱 Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// 🎯 Load Drinks
const loadDrinks = async () => {
    try {
        const response = await fetch('/drinks');
        const drinks = await response.json();
        
        drinksContainer.innerHTML = drinks.map(drink => `
            <div class="col-md-4 mb-4">
                <div class="card drink-card" data-drink-id="${drink.id}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${drink.name}</h5>
                        <p class="card-text">€${drink.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners to drink cards
        document.querySelectorAll('.drink-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedDrink = drinks.find(d => d.id === parseInt(card.dataset.drinkId));
                countModal.show();
            });
        });
    } catch (error) {
        console.error('Error loading drinks:', error);
    }
};

// 🔢 Count Modal Controls
document.getElementById('decreaseCount').addEventListener('click', () => {
    if (selectedQuantity > 1) {
        selectedQuantity--;
        document.getElementById('drinkCount').textContent = selectedQuantity;
    }
});

document.getElementById('increaseCount').addEventListener('click', () => {
    selectedQuantity++;
    document.getElementById('drinkCount').textContent = selectedQuantity;
});

document.getElementById('confirmCount').addEventListener('click', () => {
    countModal.hide();
    loadUsers();
    userModal.show();
});

// 👥 Load Users
const loadUsers = async () => {
    try {
        const response = await fetch('/users');
        const users = await response.json();
        
        document.getElementById('userList').innerHTML = users.map(user => `
            <button class="list-group-item list-group-item-action" data-user-id="${user.id}">
                ${user.name}
            </button>
        `).join('');

        // Add click listeners to user buttons
        document.querySelectorAll('#userList button').forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.dataset.userId;
                recordTransaction(userId);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// 📝 Record Transaction
const recordTransaction = async (userId) => {
    try {
        const response = await fetch('/drinks/take', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                drinkId: selectedDrink.id,
                quantity: selectedQuantity
            })
        });

        if (response.ok) {
            userModal.hide();
            selectedQuantity = 1;
            document.getElementById('drinkCount').textContent = '1';
            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'position-fixed top-0 start-50 translate-middle-x alert alert-success alert-dismissible fade show mt-3';
            alertDiv.role = 'alert';
            alertDiv.textContent = 'Transaction recorded successfully! 🎉';
            alertDiv.addEventListener('animationend', () => alertDiv.remove());
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.classList.remove('show'), 3000);
        } else {
            throw new Error('Failed to record transaction');
        }
    } catch (error) {
        console.error('Error recording transaction:', error);
        const alertDiv = document.createElement('div');
        alertDiv.className = 'position-fixed top-0 start-50 translate-middle-x alert alert-danger alert-dismissible fade show mt-3';
        alertDiv.role = 'alert';
        alertDiv.textContent = 'Failed to record transaction. Please try again.';
        alertDiv.addEventListener('animationend', () => alertDiv.remove());
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.remove('show'), 3000);
    }
};


// ℹ️ Info Button
document.getElementById('infoBtn').addEventListener('click', () => {
    loadUsers();
    infoModal.show();
});

// 👮 Admin Button
document.getElementById('adminBtn').addEventListener('click', () => {
    window.location.href = '/admin';
});

// 🚀 Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadDrinks();
});
