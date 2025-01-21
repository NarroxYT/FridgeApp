// 👑 Admin Portal JavaScript

// 🔄 Load Data Functions
const loadUsers = async () => {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        
        document.getElementById('usersTableBody').innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${new Date(user.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}" onclick="toggleUser(${user.id})">
                        ${user.active ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users');
    }
};

const loadDrinks = async () => {
    try {
        const response = await fetch('/admin/drinks');
        const drinks = await response.json();
        
        document.getElementById('drinksTableBody').innerHTML = drinks.map(drink => `
            <tr>
                <td>${drink.name}</td>
                <td>€${drink.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm ${drink.active ? 'btn-danger' : 'btn-success'}" onclick="toggleDrink(${drink.id})">${drink.active ? 'Deaktivieren' : 'Aktivieren'}</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading drinks:', error);
        alert('Failed to load drinks');
    }
};

const loadTransactions = async () => {
    try {
        const response = await fetch('/admin/transactions');
        const users = await response.json();
        
        const accordion = document.getElementById('transactionsAccordion');
        accordion.innerHTML = '';

        users.forEach((user, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            
            // Create header with user summary
            const header = `
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#user-${index}">
                        <div class="d-flex justify-content-between w-100 me-3">
                            <span>👤 ${user.user_name} ${!user.user_active ? '(Deaktiviert)' : ''}</span>
                            <span class="badge bg-primary">Total: €${user.total_spent.toFixed(2)}</span>
                        </div>
                    </button>
                </h2>
            `;

            // Create body with drink details
            const drinksList = user.drinks.map(drink => `
                <div class="drink-item d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>🥤 ${drink.drink_name}</div>
                    <div class="text-end">
                        <div>Quantity: ${drink.quantity}</div>
                        <div>Spent: €${drink.total_spent.toFixed(2)}</div>
                        <small class="text-muted">Last: ${new Date(drink.last_purchase).toLocaleDateString()}</small>
                    </div>
                </div>
            `).join('');

            const body = `
                <div id="user-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
                     data-bs-parent="#transactionsAccordion">
                    <div class="accordion-body">
                        ${drinksList}
                    </div>
                </div>
            `;

            accordionItem.innerHTML = header + body;
            accordion.appendChild(accordionItem);
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
        alert('Failed to load transactions');
    }
};

const toggleUser = async (userId) => {
    try {
        const response = await fetch(`/admin/users/${userId}/toggle`, {
            method: 'PATCH'
        });
        
        if (response.ok) {
            loadUsers(); // Reload the user list to reflect changes
        } else {
            throw new Error('Failed to toggle user status');
        }
    } catch (error) {
        console.error('Error toggling user:', error);
        alert('Failed to toggle user status');
    }
};

// Delete Functions
const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadUsers();
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
};

const toggleDrink = async (drinkId) => {
    try {
        const response = await fetch(`/admin/drinks/${drinkId}/toggle`, {
            method: 'PATCH'
        });

        if (response.ok) {
            loadDrinks();
        } else {
            throw new Error('Failed to toggle drink status');
        }
    } catch (error) {
        console.error('Error toggling drink:', error);
        alert('Failed to toggle drink status');
    }
};

const deleteDrink = async (drinkId) => {
    if (!confirm('Are you sure you want to delete this drink?')) return;
    
    try {
        const response = await fetch(`/admin/drinks/${drinkId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadDrinks();
        } else {
            throw new Error('Failed to delete drink');
        }
    } catch (error) {
        console.error('Error deleting drink:', error);
        alert('Failed to delete drink');
    }
};

// Form Submissions
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('userName').value
            })
        });
        
        if (response.ok) {
            loadUsers();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            document.getElementById('addUserForm').reset();
        } else {
            throw new Error('Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user');
    }
});

document.getElementById('addDrinkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/admin/drinks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('drinkName').value,
                price: parseFloat(document.getElementById('drinkPrice').value)
            })
        });
        
        if (response.ok) {
            loadDrinks();
            bootstrap.Modal.getInstance(document.getElementById('addDrinkModal')).hide();
            document.getElementById('addDrinkForm').reset();
        } else {
            throw new Error('Failed to add drink');
        }
    } catch (error) {
        console.error('Error adding drink:', error);
        alert('Failed to add drink');
    }
});

// Tab Change Handlers
document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', (e) => {
        const target = e.target.getAttribute('href');
        switch (target) {
            case '#users':
                loadUsers();
                break;
            case '#drinks':
                loadDrinks();
                break;
            case '#transactions':
                loadTransactions();
                break;
        }
    });
});

// Initialize Admin Portal
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
