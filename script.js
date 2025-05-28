// Scroll suave para links internos (ancoras com href começando com "#")
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Validação e feedback do formulário de contato
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    if (!form) return; // evita erro se o formulário não existir nesta página

    const feedback = document.getElementById('feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        if (nome.length < 3) {
            showFeedback("Por favor, digite um nome válido (mínimo 3 caracteres).", 'red');
            return;
        }

        if (!validateEmail(email)) {
            showFeedback("Por favor, digite um email válido.", 'red');
            return;
        }

        if (mensagem.length < 10) {
            showFeedback("A mensagem deve conter pelo menos 10 caracteres.", 'red');
            return;
        }

        // Formulário válido - mensagem de sucesso
        showFeedback(`Obrigado pelo contato, ${nome}! Responderemos em breve.`, 'green');
        form.reset();
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFeedback(msg, color) {
        if (!feedback) return;
        feedback.textContent = msg;
        feedback.style.color = color;
    }
});
