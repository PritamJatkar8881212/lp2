fetch('/api/employees')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const employeeList = document.getElementById('employee-list');
        data.forEach(employee => {
            const card = document.createElement('div');
            card.classList.add('employee-card');

            const img = document.createElement('img');
            img.src = employee.image || 'https://via.placeholder.com/50'; // Default placeholder image if no image is provided

            const details = document.createElement('div');
            const name = document.createElement('h3');
            name.textContent = employee.name;
            const designation = document.createElement('p');
            designation.textContent = `Designation: ${employee.designation}`;
            const department = document.createElement('p');
            department.textContent = `Department: ${employee.department}`;
            const salary = document.createElement('p');
            salary.textContent = `Salary: ₹${employee.salary}`;
            salary.classList.add('salary');

            details.appendChild(name);
            details.appendChild(designation);
            details.appendChild(department);
            details.appendChild(salary);

            card.appendChild(img);
            card.appendChild(details);

            employeeList.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
    });
