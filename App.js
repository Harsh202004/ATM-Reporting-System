document.getElementById('showLoginForm').addEventListener('click', () => {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('reportForm').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
  });
  
  document.getElementById('showSignupForm').addEventListener('click', () => {
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('reportForm').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
  });
  
  document.getElementById('showAdminLoginForm').addEventListener('click', () => {
    document.getElementById('adminLoginForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('reportForm').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
  });
  
  document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
    if (password !== confirmPassword) {
      document.getElementById('signupError').textContent = 'Passwords do not match';
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (response.ok) {
        alert('Signup successful! Please login.');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('signupForm').classList.add('hidden');
      } else {
        const errorData = await response.json();
        document.getElementById('signupError').textContent = `Signup failed: ${errorData.message}`;
      }
    } catch (error) {
      document.getElementById('signupError').textContent = 'Failed to signup due to a network error.';
    }
  });
  
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('reportForm').classList.remove('hidden');
      } else {
        const errorData = await response.json();
        document.getElementById('loginError').textContent = `Login failed: ${errorData.message}`;
      }
    } catch (error) {
      document.getElementById('loginError').textContent = 'Failed to login due to a network error.';
    }
  });
  
  document.getElementById('adminLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
  
    try {
      const response = await fetch('http://localhost:3000/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('adminLoginForm').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminDashboard();
      } else {
        const errorData = await response.json();
        document.getElementById('adminLoginError').textContent = `Login failed: ${errorData.message}`;
      }
    } catch (error) {
      document.getElementById('adminLoginError').textContent = 'Failed to login due to a network error.';
    }
  });
  
  document.getElementById('reportForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a report.');
      document.getElementById('loginForm').classList.remove('hidden');
      document.getElementById('reportForm').classList.add('hidden');
      return;
    }
  
    const atmLocation = document.getElementById('atmLocation').value;
    const problem = document.getElementById('problem').value;
  
    try {
      const response = await fetch('http://localhost:3000/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ atmLocation, problem }),
      });
  
      if (response.ok) {
        alert('Report submitted successfully!');
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Failed to authenticate token') {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          document.getElementById('loginForm').classList.remove('hidden');
          document.getElementById('reportForm').classList.add('hidden');
        } else {
          document.getElementById('reportError').textContent = `Failed to submit report: ${errorData.message}`;
        }
      }
    } catch (error) {
      document.getElementById('reportError').textContent = 'Failed to submit report due to a network error.';
    }
  });
  
  async function loadAdminDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login as admin.');
      document.getElementById('adminLoginForm').classList.remove('hidden');
      document.getElementById('adminDashboard').classList.add('hidden');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/admin/reports', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const reports = await response.json();
        const reportsTableBody = document.getElementById('reportsTable').getElementsByTagName('tbody')[0];
        reportsTableBody.innerHTML = '';
  
        reports.forEach(report => {
          const row = reportsTableBody.insertRow();
          const usernameCell = row.insertCell(0);
          const atmLocationCell = row.insertCell(1);
          const problemCell = row.insertCell(2);
          const dateCell = row.insertCell(3);
  
          usernameCell.textContent = report.userId.username;
          atmLocationCell.textContent = report.atmLocation;
          problemCell.textContent = report.problem;
          dateCell.textContent = new Date(report.date).toLocaleString();
        });
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Failed to authenticate token') {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          document.getElementById('adminLoginForm').classList.remove('hidden');
          document.getElementById('adminDashboard').classList.add('hidden');
        } else {
          document.getElementById('adminLoginError').textContent = `Failed to load reports: ${errorData.message}`;
        }
      }
    } catch (error) {
      document.getElementById('adminLoginError').textContent = 'Failed to load reports due to a network error.';
    }
  }
  