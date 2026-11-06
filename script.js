document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }

    // File Upload Handlers
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const fileNameSpan = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file');
    const processBtn = document.getElementById('process-btn');

    let selectedFile = null;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        selectedFile = file;
        fileNameSpan.textContent = file.name;
        dropzone.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        processBtn.removeAttribute('disabled');
    }

    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedFile = null;
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        dropzone.classList.remove('hidden');
        processBtn.setAttribute('disabled', 'true');
    });

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(`${btn.dataset.tab}-tab`);
            targetTab.classList.add('active');
        });
    });

    // Process Mock & API Simulation
    const transcriptionOutput = document.getElementById('transcription-output');
    const translationOutput = document.getElementById('translation-output');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    processBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        processBtn.setAttribute('disabled', 'true');
        processBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

        setTimeout(() => {
            transcriptionOutput.value = "प्राचीन भारतीय साहित्य और संस्कृति की यह पांडुलिपि देवनागरी लिपि में लिखित है। इसमें विभिन्न ऐतिहासिक साक्ष्यों और सांस्कृतिक विवरणों का संकलन किया गया है।";
            translationOutput.value = "This manuscript of ancient Indian literature and culture is written in the Devanagari script. It contains a compilation of various historical evidences and cultural descriptions.";

            processBtn.innerHTML = `Get Started <i class="fa-solid fa-arrow-right"></i>`;
            processBtn.removeAttribute('disabled');
            copyBtn.removeAttribute('disabled');
            downloadBtn.removeAttribute('disabled');
        }, 1500);
    });

    // Copy Content
    copyBtn.addEventListener('click', () => {
        const activePane = document.querySelector('.tab-pane.active textarea');
        navigator.clipboard.writeText(activePane.value);
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        setTimeout(() => {
            copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i>`;
        }, 1500);
    });

    // Download Content
    downloadBtn.addEventListener('click', () => {
        const activeTabName = document.querySelector('.tab-btn.active').dataset.tab;
        const activePane = document.querySelector('.tab-pane.active textarea');
        
        const blob = new Blob([activePane.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTabName}-output.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Authentication Modal Logic
    const loginNavBtn = document.getElementById('nav-login-btn');
    const signupNavBtn = document.getElementById('nav-signup-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const nameField = document.getElementById('name-field');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('switch-text');
    const authForm = document.getElementById('auth-form');

    let isLoginMode = true;

    function openModal(loginMode = true) {
        isLoginMode = loginMode;
        authModal.classList.remove('hidden');
        if (isLoginMode) {
            modalTitle.textContent = "Welcome Back";
            modalSubtitle.textContent = "Enter your credentials to access your workspace";
            nameField.classList.add('hidden');
            authSubmitBtn.textContent = "Login";
            switchText.innerHTML = `Don't have an account? <a href="#" id="switch-mode-btn">Sign up</a>`;
        } else {
            modalTitle.textContent = "Create an Account";
            modalSubtitle.textContent = "Start transcribing your Indic manuscripts today";
            nameField.classList.remove('hidden');
            authSubmitBtn.textContent = "Sign up";
            switchText.innerHTML = `Already have an account? <a href="#" id="switch-mode-btn">Login</a>`;
        }
        rebindSwitchListener();
    }

    function closeModal() {
        authModal.classList.add('hidden');
        authForm.reset();
    }

    loginNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(true);
    });

    signupNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(false);
    });

    closeModalBtn.addEventListener('click', closeModal);

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    function rebindSwitchListener() {
        const newSwitchBtn = document.getElementById('switch-mode-btn');
        if (newSwitchBtn) {
            newSwitchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(!isLoginMode);
            });
        }
    }

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const actionType = isLoginMode ? "Logging in" : "Signing up";
        authSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Please wait...`;
        
        setTimeout(() => {
            alert(`${actionType} successful!`);
            authSubmitBtn.textContent = isLoginMode ? "Login" : "Sign up";
            closeModal();
        }, 1000);
    });
});
