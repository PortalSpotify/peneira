// Configuração do link de redirecionamento
const REDIRECT_URL = 'https://www.example.com/peneiras'; // Substitua pelo link desejado

// Elementos DOM
const searchBtn = document.getElementById('search-btn');
const backToTopBtn = document.getElementById('back-to-top');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicação...');
    
    // Event listener para o botão de busca principal
    if (searchBtn) {
        searchBtn.addEventListener('click', redirectToLink);
    }
    
    // Event listener para menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // Event listener para botão voltar ao topo
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Event listeners para scroll
    window.addEventListener('scroll', handleScroll);
    
    // Animações de scroll
    setupScrollAnimations();
    
    // Animação dos números das estatísticas
    animateStats();
    
    // Configurar indicador de scroll
    setupScrollIndicator();
}

// Função principal de redirecionamento
function redirectToLink() {
    console.log('Redirecionando para:', REDIRECT_URL);
    
    // Adicionar efeito visual no botão
    if (searchBtn) {
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';
        searchBtn.style.pointerEvents = 'none';
    }
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
        window.open(REDIRECT_URL, '_blank');
        
        // Restaurar botão após redirecionamento
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar Peneiras';
            searchBtn.style.pointerEvents = 'auto';
        }
    }, 500);
}

// Função para alternar menu mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Função para fechar menu mobile
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// Função para lidar com scroll
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header com efeito de scroll
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Botão voltar ao topo
    if (scrollY > 500) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.opacity = '1';
    } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => {
            if (window.scrollY <= 500) {
                backToTopBtn.style.display = 'none';
            }
        }, 300);
    }
}

// Função para voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para configurar indicador de scroll
function setupScrollIndicator() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('como-funciona').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Função para animar estatísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Função para animar números
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'k+';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 20);
}

// Função para configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.step-card, .contact-card, .about-text, .about-image');
    animatedElements.forEach(el => observer.observe(el));
}

// Função para mostrar notificação (caso necessário)
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Adicionar classe de animação aos elementos quando carregarem
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


