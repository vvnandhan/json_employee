// Define the API URL for JSON Server (default port is 3000)
const apiUrl = 'http://localhost:3000/employees';

// When the DOM content is loaded, initialize our functions.
document.addEventListener('DOMContentLoaded', () => {
  fetchEmployees();

  // Listen for form submissions to add or update an employee.
  const form = document.getElementById('employee-form');
  form.addEventListener('submit', handleFormSubmit);

  // Cancel edit functionality resets the form.
  const cancelEditBtn = document.getElementById('cancel-edit');
  cancelEditBtn.addEventListener('click', resetForm);
});

// Fetch the list of employees from JSON Server.
function fetchEmployees() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Error fetching employees:', error));
}

// Populate the employee table with data.
function populateTable(employees) {
  const tbody = document.getElementById('employee-table').querySelector('tbody');
  tbody.innerHTML = ''; // Clear existing rows

  employees.forEach(employee => {
    const row = tbody.insertRow();
    row.insertCell().innerText = employee.id;
    row.insertCell().innerText = employee.first_name;
    row.insertCell().innerText = employee.last_name;
    row.insertCell().innerText = employee.department;
    row.insertCell().innerText = employee.salary;

    // Actions cell for Edit and Delete buttons.
    const actionsCell = row.insertCell();

    // Edit button: fills form with employee data for editing.
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => populateFormForEdit(employee);
    actionsCell.appendChild(editButton);

    // Delete button: sends a DELETE request to JSON Server.
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteEmployee(employee.id);
    actionsCell.appendChild(deleteButton);
  });
}

// Handle form submission for both creating and updating employees.
function handleFormSubmit(event) {
  event.preventDefault();
  const employeeId = document.getElementById('employee-id').value;
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const department = document.getElementById('department').value;
  let salary = document.getElementById('salary').value;

  // If no salary is provided, generate a random salary between 30000 and 100000.
  if (!salary) {
    salary = generateRandomSalary();
  }

  const employeeData = {
    first_name: firstName,
    last_name: lastName,
    department: department,
    salary: Number(salary)
  };

  if (employeeId) {
    // If employeeId is present, update the existing employee using PUT.
    fetch(`${apiUrl}/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    })
    .then(() => {
      resetForm();
      fetchEmployees();
    })
    .catch(error => console.error('Error updating employee:', error));
  } else {
    // If no employeeId, create a new employee using POST.
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    })
    .then(() => {
      resetForm();
      fetchEmployees();
    })
    .catch(error => console.error('Error creating employee:', error));
  }
}

// When editing, fill the form with the employee's current details.
function populateFormForEdit(employee) {
  document.getElementById('employee-id').value = employee.id;
  document.getElementById('first_name').value = employee.first_name;
  document.getElementById('last_name').value = employee.last_name;
  document.getElementById('department').value = employee.department;
  document.getElementById('salary').value = employee.salary;
  document.getElementById('cancel-edit').style.display = 'inline';
}

// Resets the form fields and hides the cancel edit button.
function resetForm() {
  document.getElementById('employee-id').value = '';
  document.getElementById('first_name').value = '';
  document.getElementById('last_name').value = '';
  document.getElementById('department').value = '';
  document.getElementById('salary').value = '';
  document.getElementById('cancel-edit').style.display = 'none';
}

// Send a DELETE request to remove an employee.
function deleteEmployee(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(() => fetchEmployees())
  .catch(error => console.error('Error deleting employee:', error));
}

// Generate a random salary between 30000 and 100000.
function generateRandomSalary() {
  return Math.floor(Math.random() * (100000 - 30000 + 1)) + 30000;
}
