document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-btn');
    const redirectLink = 'https://www.example.com'; // Substitua pelo seu link desejado

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            window.location.href = redirectLink;
        });
    }

    // Remover elementos relacionados ao CEP do DOM, se existirem
    const cepInput = document.getElementById('cep-input');
    const getLocationBtn = document.getElementById('get-location-btn');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const heroStats = document.querySelector('.hero-stats');
    const howItWorksSection = document.getElementById('como-funciona');

    if (cepInput) {
        cepInput.remove();
    }
    if (getLocationBtn) {
        getLocationBtn.remove();
    }
    if (searchSuggestions) {
        searchSuggestions.remove();
    }
    if (heroStats) {
        heroStats.remove();
    }
    if (howItWorksSection) {
        howItWorksSection.remove();
    }

    // Adaptar o texto da descrição do herói
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.textContent = 'Clique no botão abaixo para encontrar as melhores oportunidades de peneiras de futebol.';
    }

    // Remover a seção de resultados, se existir
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.remove();
    }

    // Remover a seção CTA que também menciona busca
    const ctaSection = document.querySelector('.cta');
    if (ctaSection) {
        ctaSection.remove();
    }

    // Remover o item 'Como Funciona' do menu de navegação
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const howItWorksLink = navMenu.querySelector('a[href="#como-funciona"]');
        if (howItWorksLink && howItWorksLink.parentElement) {
            howItWorksLink.parentElement.remove();
        }
    }
});


