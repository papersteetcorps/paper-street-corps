function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Modal Logic
const modal = document.getElementById('auth-modal');
const modalTitle = document.getElementById('modal-title');

document.querySelectorAll('.auth-trigger').forEach(btn => {
    btn.onclick = () => {
        modal.style.display = 'flex';
        modalTitle.innerText = btn.innerText;
    }
});

function closeAuthModal() {
    modal.style.display = 'none';
}

// Load Theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').checked = true;
}