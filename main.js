const apiUrl = 'https://reqres.in/api/users';
const userList = document.getElementById('user-list');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-button');
const clearBtn = document.getElementById('clear-btn');
const pagination = document.getElementById('pagination');

let allUsers = [];
let totalPages = 1;

let occupationList = ['Doctor', 'Engineer', 'Artist', 'Teacher'];
let statusList = ['Active', 'Inactive'];

//---------------------------- Fetch User Data ----------------------------
function fetchUserData(page = 1) {
    showLoader(true);
    userList.innerHTML = '';
    fetch(`${apiUrl}?page=${page}`, {
        method: 'GET',
        headers: {
            'x-api-key': 'reqres-free-v1'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('User data:', data);
            allUsers = data.data.map(user => {
                return {
                    ...user,
                    occupation: occupationList[Math.floor(Math.random() * occupationList.length)],
                    status: statusList[Math.floor(Math.random() * statusList.length)]
                };
            });

            totalPages = data.total_pages;
            renderUserCards(allUsers);
            renderPagination(totalPages, page);
            showLoader(false);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

//---------------------------- Render User Cards ----------------------------
function renderUserCards(users) {
    userList.innerHTML = '';

    if (users.length === 0) {
        userList.innerHTML = `<p>No users found.</p>`;
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        userCard.innerHTML = `
            <div class="user-photo">
                <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}">
            </div>
            <div class="user-info">
                <h3 class="user-name">${user.first_name} ${user.last_name}</h3>
                <p class="user-occupation">Occupation: ${user.occupation}</p>
                <p class="user-status">Status: ${user.status}</p>
                <p class="user-email">${user.email}</p>

            </div>
        `;

        userList.appendChild(userCard);
    });
}

// ----------------------- Render pagination buttons ----------------------------
function renderPagination(total, currentPage) {
    pagination.innerHTML = '';

    for (let i = 1; i <= total; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener('click', () => {
            fetchUserData(i);
        });

        pagination.appendChild(pageBtn);
    }
}

// ----------------------------- Search button logic ---------------------------------
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') return;

    const filteredUsers = allUsers.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) || `${user.occupation}`.toLowerCase().includes(query) ||
        `${user.status}`.toLowerCase().includes(query)
    );

    renderUserCards(filteredUsers);
});

// --------------------------- Search on Enter key --------------------------------------
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ---------------------------- Clear button logic ---------------------------------
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderUserCards(allUsers);
});

// -------------------------------- Show loader ------------------------------------
function showLoader(show) {
    const loader = document.getElementById('loading');
    loader.style.display = show ? 'block' : 'none';
}


fetchUserData(1);

const filterBtn = document.getElementById('filter-btn');
const modal = document.getElementById('filter-modal');
const closeModal = document.getElementById('close-modal');
const applyFilterBtn = document.getElementById('apply-filter');
const clearFilterBtn = document.getElementById('clear-filter');

const occupationFilter = document.getElementById('occupation-filter');
const statusFilter = document.getElementById('status-filter');

// ------------------------------- Show Filter modal -------------------------------------
filterBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// -------------------------------- Hide Filter modal ------------------------------------
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// ----------------------------- Apply filter -------------------------------------------
applyFilterBtn.addEventListener('click', () => {
    const selectedOccupation = occupationFilter.value;
    const selectedStatus = statusFilter.value;

    let filteredUsers = allUsers;

    if (selectedOccupation) {
        filteredUsers = filteredUsers.filter(user => user.occupation === selectedOccupation);
    }

    if (selectedStatus) {
        filteredUsers = filteredUsers.filter(user => user.status === selectedStatus);
    }

    renderUserCards(filteredUsers);
    pagination.style.display = 'none'; 
    modal.style.display = 'none'; 
});

// -------------------------------- Clear filter ---------------------------------------------
clearFilterBtn.addEventListener('click', () => {
    occupationFilter.value = '';
    statusFilter.value = '';
    renderUserCards(allUsers);
    pagination.style.display = 'block';
    modal.style.display = 'none';
});

// ---------------------------- Close modal if clicked outside ---------------------------------
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ---------------------------------- theme toggle ------------------------------------------
const themeBtn = document.getElementById('theme-button');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const icon = themeBtn.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// --------------------------------- Profile card toggle ------------------------------------
const profileToggleBtn = document.getElementById('profile-toggle');
const profileCard = document.getElementById('profile-card');

profileToggleBtn.addEventListener('click', () => {
    profileCard.style.display = profileCard.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
    if (!profileCard.contains(e.target) && !profileToggleBtn.contains(e.target)) {
        profileCard.style.display = 'none';
    }
});


// ------------------------------ Toggle form vs user section --------------------------------------
const userDirectoryLink = document.querySelector('.menu a:nth-child(1)');
const formLink = document.querySelector('.menu a:nth-child(2)');
const userListContainer = document.getElementById('user-main');
const formSection = document.getElementById('form-section');

formLink.addEventListener('click', (e) => {
    e.preventDefault();
    formLink.classList.add('active-link')
    userDirectoryLink.classList.remove('active-link')
    userListContainer.style.display = 'none';
    formSection.style.display = 'block';
});

userDirectoryLink.addEventListener('click', (e) => {
    e.preventDefault();
    formLink.classList.remove('active-link')
    userDirectoryLink.classList.add('active-link')
    formSection.style.display = 'none';
    userListContainer.style.display = 'grid';
});

// ------------------------------------- Real-time validation -------------------------------------------
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

nameInput.addEventListener('input', () => {
    nameError.textContent = nameInput.value.trim() === '' ? 'Name is required' : '';
});

emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    emailError.textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Invalid email';
});

passwordInput.addEventListener('input', () => {
    passwordError.textContent = passwordInput.value.length < 6 ? 'Password must be at least 6 characters' : '';
});

// ---------------------------------------  prevent submit if errors -------------------------------------------
document.getElementById('user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Trigger validation
    nameInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    if (!nameError.textContent && !emailError.textContent && !passwordError.textContent) {
        alert('Form submitted successfully!');
        document.getElementById('user-form').reset();
    }
});

// -------------------------------- Accordion Menu Functionalities -------------------------------------------
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
    });
});

const accordionToggle = document.getElementById('accordion-toggle');
const accordionSidebar = document.getElementById('accordion-sidebar');

accordionToggle.addEventListener('click', () => {
    accordionSidebar.classList.toggle('active');
});

window.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && accordionSidebar.classList.contains('active')) {
        if (!accordionSidebar.contains(e.target) && !accordionToggle.contains(e.target)) {
            accordionSidebar.classList.remove('active');
        }
    }
});

const nestedParents = document.querySelectorAll('.has-submenu');

nestedParents.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); 
        item.classList.toggle('open');
    });
});






