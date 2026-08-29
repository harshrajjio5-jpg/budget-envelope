let income = 0;
let envelopes = [];


// Set Income
function setIncome() {

    const input = document.getElementById("incomeInput");

    income = Number(input.value);

    if (income <= 0) {
        alert("Please enter a valid income.");
        return;
    }

    updateDashboard();
}


// Add Envelope
function addEnvelope() {

    const category = document
        .getElementById("categoryInput")
        .value
        .trim();

    const budget = Number(
        document.getElementById("budgetInput").value
    );

    if (category === "" || budget <= 0) {
        alert("Please enter category and budget.");
        return;
    }

    const allocated = envelopes.reduce(
        (total, envelope) => total + envelope.budget,
        0
    );

    if (allocated + budget > income) {
        alert("You don't have enough income for this envelope.");
        return;
    }

    const envelope = {
        id: Date.now(),
        category: category,
        budget: budget,
        spent: 0
    };

    envelopes.push(envelope);

    document.getElementById("categoryInput").value = "";
    document.getElementById("budgetInput").value = "";

    updateDashboard();
}


// Add Expense
function addExpense(id) {

    const input = document.getElementById(`expense-${id}`);

    const expense = Number(input.value);

    if (expense <= 0) {
        alert("Enter a valid expense.");
        return;
    }

    const envelope = envelopes.find(
        envelope => envelope.id === id
    );

    if (!envelope) return;

    if (envelope.spent + expense > envelope.budget) {
        alert("This expense is greater than your envelope balance.");
        return;
    }

    envelope.spent += expense;

    input.value = "";

    updateDashboard();
}


// Delete Envelope
function deleteEnvelope(id) {

    envelopes = envelopes.filter(
        envelope => envelope.id !== id
    );

    updateDashboard();
}


// Update Dashboard
function updateDashboard() {

    const allocated = envelopes.reduce(
        (total, envelope) => total + envelope.budget,
        0
    );

    const remaining = income - allocated;

    document.getElementById("totalIncome").innerText =
        `₹${income.toLocaleString()}`;

    document.getElementById("allocated").innerText =
        `₹${allocated.toLocaleString()}`;

    document.getElementById("remaining").innerText =
        `₹${remaining.toLocaleString()}`;

    renderEnvelopes();
}


// Display Envelopes
function renderEnvelopes() {

    const container =
        document.getElementById("envelopeContainer");

    container.innerHTML = "";

    if (envelopes.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <p>No envelopes yet.</p>
                <p>Create your first budget envelope above 👆</p>
            </div>
        `;

        return;
    }


    envelopes.forEach(envelope => {

        const remaining =
            envelope.budget - envelope.spent;

        const percentage =
            (envelope.spent / envelope.budget) * 100;


        const card = document.createElement("div");

        card.className = "envelope";

        card.innerHTML = `

            <div class="envelope-header">

                <h3>✉️ ${envelope.category}</h3>

                <span class="amount">
                    ₹${remaining.toLocaleString()}
                </span>

            </div>


            <p>
                Spent:
                ₹${envelope.spent.toLocaleString()}
                /
                ₹${envelope.budget.toLocaleString()}
            </p>


            <div class="progress">

                <div 
                    class="progress-bar"
                    style="width: ${Math.min(percentage, 100)}%"
                >
                </div>

            </div>


            <p>
                Remaining:
                ₹${remaining.toLocaleString()}
            </p>


            <div class="expense-input">

                <input
                    type="number"
                    id="expense-${envelope.id}"
                    placeholder="Expense amount"
                >

                <button
                    onclick="addExpense(${envelope.id})"
                >
                    Add
                </button>

            </div>


            <button
                class="delete-btn"
                onclick="deleteEnvelope(${envelope.id})"
            >
                Delete Envelope
            </button>

        `;

        container.appendChild(card);

    });
}