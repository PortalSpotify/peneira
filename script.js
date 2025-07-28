// Dados simulados de peneiras de futebol - VERSÃO SIMPLIFICADA
const peneirasData = [
    {
        id: 1,
        titulo: "Peneira Sub-16 e Sub-17",
        clube: "Base - Atlético Mineiro",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "14:00",
        categoria: "Sub-16 até Sub-17",
        requisitos: "Idade Entre 16-17 anos",
        contato: "(13) 3257-4000",
        distancia: 2.5,
        lat: -23.9618,
        lng: -46.3322,
        status: "aberta",
        vagasDisponiveis: 8,
        totalVagas: 60,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 2,
        titulo: "Peneira Sub-08",
        clube: "Base - Paysandu FC",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "09:00",
        categoria: "Sub-09",
        requisitos: "Idade entre 08-09 anos",
        contato: "(11) 3670-8100",
        distancia: 5.8,
        lat: -23.5505,
        lng: -46.6333,
        status: "encerrada",
        vagasDisponiveis: 0,
        totalVagas: 40,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: true
    },
    {
        id: 3,
        titulo: "Peneira Sub-09 até Sub-12",
        clube: "Base - Internacional FC",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "15:30",
        categoria: "Sub-09 até Sub-12",
        requisitos: "Idade entre 09-12 anos",
        contato: "(11) 2095-3000",
        distancia: 8.2,
        lat: -23.5629,
        lng: -46.6544,
        status: "aberta",
        vagasDisponiveis: 3,
        totalVagas: 70,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 4,
        titulo: "Peneira Sub-13 até Sub-15",
        clube: "Base - Água Santa FC",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "10:00",
        categoria: "Sub-13 até Sub-15",
        requisitos: "Idade entre 13-15 anos",
        contato: "(11) 3873-2400",
        distancia: 12.1,
        lat: -23.5629,
        lng: -46.6544,
        status: "aberta",
        vagasDisponiveis: 9,
        totalVagas: 60,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    },
    {
        id: 5,
        titulo: "Peneira Sub-18 até Sub-21",
        clube: "Red Bull Bragantino",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "13:00",
        categoria: "Sub-18 até Sub-21",
        requisitos: "Idade entre 18-21 anos",
        contato: "(11) 4034-1900",
        distancia: 45.3,
        lat: -22.9519,
        lng: -46.5428,
        status: "encerrada",
        vagasDisponiveis: 0,
        totalVagas: 25,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: true
    },
    {
        id: 6,
        titulo: "Peneira Sub-21 +",
        clube: "Ponte Preta",
        endereco: null, // Será preenchido com o CEP do usuário
        data: "2025-08-10",
        horario: "14:30",
        categoria: "Sub-21 +",
        requisitos: "Idade 21 +",
        contato: "(19) 3231-3444",
        distancia: 35.7,
        lat: -22.9056,
        lng: -47.0608,
        status: "aberta",
        vagasDisponiveis: 7,
        totalVagas: 85,
        prazoInscricao: "2025-08-05",
        inscricaoEncerrada: false
    }
];

// Cache para armazenar endereços já consultados
const enderecoCache = new Map();

// Função para buscar endereço por CEP via ViaCEP
async function buscarEnderecoPorCEP(cep) {
    // Limpar CEP (remover hífen e espaços)
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Verificar se já está no cache
    if (enderecoCache.has(cepLimpo)) {
        console.log(`CEP ${cep} encontrado no cache:`, enderecoCache.get(cepLimpo));
        return enderecoCache.get(cepLimpo);
    }
    
    // Validar formato do CEP
    if (cepLimpo.length !== 8) {
        console.error(`CEP inválido: ${cep} (deve ter 8 dígitos)`);
        return 'CEP inválido';
    }
    
    try {
        console.log(`Buscando CEP ${cep} (${cepLimpo}) na API ViaCEP...`);
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Resposta da API para CEP ${cep}:`, data);
        
        if (data.erro) {
            throw new Error('CEP não encontrado na base de dados');
        }
        
        if (!data.localidade || !data.uf) {
            throw new Error('Dados incompletos retornados pela API');
        }
        
        const endereco = `${data.localidade}, ${data.uf}`;
        console.log(`Endereço formatado para CEP ${cep}: ${endereco}`);
        
        // Armazenar no cache
        enderecoCache.set(cepLimpo, endereco);
        
        return endereco;
    } catch (error) {
        console.error(`Erro ao buscar CEP ${cep}:`, error.message);
        // Retornar um endereço padrão em caso de erro
        return 'Localização não disponível';
    }
}

// Variáveis globais
let userLocation = null;
let currentResults = [];
let currentFilter = 'all';

// Elementos DOM
const cepInput = document.getElementById('cep-input');
const getLocationBtn = document.getElementById('get-location-btn');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results');
const resultsContainer = document.getElementById('results-container');
const noResults = document.getElementById('no-results');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingAddress = document.getElementById('loading-address');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
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
    
    // Event listeners para busca
    searchBtn.addEventListener('click', handleSearch);
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Event listener para obter localização atual
    getLocationBtn.addEventListener('click', getCurrentLocation);
    
    // Event listeners para sugestões
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            cepInput.value = location;
            handleSearch();
        });
    });
    
    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            applyFilter(filter);
        });
    });
    
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

// Função para obter localização atual do usuário
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocalização não é suportada pelo seu navegador', 'error');
        return;
    }
    
    showLoading();
    getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Busca de endereço reverso
            reverseGeocode(userLocation.lat, userLocation.lng)
                .then(address => {
                    cepInput.value = address;
                    hideLoading();
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    handleSearch();
                })
                .catch(error => {
                    hideLoading();
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
                    showNotification('Erro ao obter endereço', 'error');
                });
        },
        function(error) {
            hideLoading();
            getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i>';
            
            let message = 'Erro ao obter localização';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Permissão de localização negada';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Localização indisponível';
                    break;
                case error.TIMEOUT:
                    message = 'Tempo limite excedido';
                    break;
            }
            showNotification(message, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// Função de geocodificação reversa - CORRIGIDA
async function reverseGeocode(lat, lng) {
    // TODO: Substituir esta função por uma chamada a uma API de geocodificação reversa real 
    // (ex: Google Maps Geocoding API, OpenStreetMap Nominatim).
    // Esta função deve retornar uma string com o endereço formatado (ex: "Cidade, UF").
    // Exemplo de como seria uma chamada (requer chave de API e tratamento de erros):
    /*
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=SUA_CHAVE_API`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            let city = '';
            let state = '';
            for (const component of addressComponents) {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }
            }
            if (city && state) {
                return `${city}, ${state}`;
            } else if (data.results[0].formatted_address) {
                return data.results[0].formatted_address;
            }
        }
        return 'Localização não disponível';
    } catch (error) {
        console.error('Erro ao buscar endereço via API de geocodificação:', error);
        return 'Localização não disponível';
    }
    */
    console.warn('Função reverseGeocode está usando um placeholder. Substitua por uma API real em produção.');
    return `Localização (${lat}, ${lng}) - Placeholder`;
}

// Função para calcular distância entre duas coordenadas
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Função principal de busca - CORRIGIDA (removido atraso artificial)
async function handleSearch() {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showNotification('Por favor, digite um CEP válido com 8 dígitos.', 'warning');
        cepInput.focus();
        return;
    }

    showLoading(true);

    try {
        console.log(`Buscando endereço para CEP do usuário: ${cep}`);
        
        // Buscar endereço do CEP digitado pelo usuário
        const enderecoUsuario = await buscarEnderecoPorCEP(cep);
        
        if (enderecoUsuario === 'CEP inválido' || enderecoUsuario === 'Localização não disponível') {
            showNotification('CEP não encontrado. Verifique o número digitado.', 'error');
            hideLoading();
            return;
        }

        console.log(`Endereço do usuário encontrado: ${enderecoUsuario}`);
        
        // Aplicar o endereço do usuário a TODAS as peneiras
        peneirasData.forEach(peneira => {
            peneira.endereco = enderecoUsuario;
        });
        
        console.log(`Endereço "${enderecoUsuario}" aplicado a todas as ${peneirasData.length} peneiras`);

        loadingAddress.textContent = `Buscando peneiras próximas a ${enderecoUsuario}`;
        document.getElementById('loading-neighborhood').textContent = ``;

        // CORRIGIDO: Removido atraso artificial - busca imediata
        searchPeneiras(enderecoUsuario);

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
        hideLoading();
    }
}

// Função para buscar peneiras
function searchPeneiras(location) {
    try {
        // Simular geocodificação da localização digitada
        const userCoords = geocodeLocation(location);
        
        // Calcular distâncias e filtrar resultados
        const results = peneirasData.map(peneira => {
            const distance = calculateDistance(
                userCoords.lat, userCoords.lng,
                peneira.lat, peneira.lng
            );
            
            return {
                ...peneira,
                distancia: Math.round(distance * 10) / 10
            };
        }).sort((a, b) => a.distancia - b.distancia);
        
        // Filtrar apenas peneiras em um raio de 100km
        currentResults = results.filter(peneira => peneira.distancia <= 100);
        
        hideLoading();
        displayResults(currentResults);
        
    } catch (error) {
        hideLoading();
        showNotification('Erro ao buscar peneiras. Tente novamente.', 'error');
    }
}

// Função simulada de geocodificação
function geocodeLocation(location) {
    // Coordenadas simuladas baseadas na localização
    const locationMap = {
        'são paulo': { lat: -23.5505, lng: -46.6333 },
        'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
        'belo horizonte': { lat: -19.9167, lng: -43.9345 },
        'porto alegre': { lat: -30.0346, lng: -51.2177 },
        'salvador': { lat: -12.9714, lng: -38.5014 },
        'brasília': { lat: -15.8267, lng: -47.9218 },
        'santos': { lat: -23.9618, lng: -46.3322 },
        'campinas': { lat: -22.9056, lng: -47.0608 }
    };
    
    const normalizedLocation = location.toLowerCase();
    
    // Procurar por correspondência parcial
    for (const [key, coords] of Object.entries(locationMap)) {
        if (normalizedLocation.includes(key.split(' ')[0])) {
            return coords;
        }
    }
    
    // Coordenadas padrão (São Paulo) se não encontrar
    return { lat: -23.5505, lng: -46.6333 };
}

// Função para exibir resultados - CORRIGIDA (com carregamento condicional de anúncios)
function displayResults(peneiras) {
    resultsContainer.innerHTML = "";
    if (peneiras.length === 0) {
        noResults.style.display = "block";
        resultsSection.style.display = "none";
    } else {
        noResults.style.display = "none";
        resultsSection.style.display = "block";
        peneiras.forEach(peneira => {
            const card = document.createElement("div");
            card.classList.add("result-card");
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title-section">
                        <h3 class="card-title">${peneira.titulo}</h3>
                        <span class="card-club">${peneira.clube}</span>
                    </div>
                    <div class="card-badges">
                        <span class="distance-badge">${peneira.distancia} km</span>
                        <span class="status-badge ${peneira.status === 'aberta' ? 'status-open' : 'status-closed'}">${peneira.status === 'aberta' ? 'Aberta' : 'Encerrada'}</span>
                    </div>
                </div>
                <div class="card-body">
                    <p><i class="fas fa-map-marker-alt"></i> ${peneira.endereco}</p>
                    <p><i class="fas fa-calendar-alt"></i> ${new Date(peneira.data).toLocaleDateString('pt-BR')} às ${peneira.horario}</p>
                    <p><i class="fas fa-users"></i> Categoria: ${peneira.categoria}</p>
                    <p><i class="fas fa-info-circle"></i> Requisitos: ${peneira.requisitos}</p>
                    <p><i class="fas fa-phone"></i> Contato: ${peneira.contato}</p>
                    ${peneira.status === 'aberta' ? `<p class="vagas-info"><i class="fas fa-ticket-alt"></i> Vagas: ${peneira.vagasDisponiveis}/${peneira.totalVagas} (Prazo: ${new Date(peneira.prazoInscricao).toLocaleDateString('pt-BR')})</p>` : ''}
                </div>
                <div class="card-actions">
                    ${peneira.status === 'aberta' ? `<button class="btn-primary" onclick="showNotification('Inscrição para ${peneira.titulo} em ${peneira.clube}!', 'success')">Inscrever-se</button>` : `<button class="btn-secondary" disabled>Inscrições Encerradas</button>`}
                </div>
            `;
            resultsContainer.appendChild(card);
        });
        
        // CORRIGIDO: Chama a função de carregamento de anúncios após a seção de resultados se tornar visível
        loadGoogleAds();
    }
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Função para carregar anúncios do Google Ads condicionalmente - ADICIONADA
// ESTA É UMA FUNÇÃO CONCEITUAL. VOCÊ DEVE SUBSTITUIR PELA SUA LÓGICA REAL DE CARREGAMENTO DE ANÚNCIOS.
function loadGoogleAds() {
    // Verifica se a seção de resultados está visível antes de carregar anúncios.
    // Isso evita que anúncios sejam carregados em elementos ocultos, o que pode ser uma violação das políticas do Google Ads.
    if (resultsSection.style.display !== 'none' && resultsSection.offsetHeight > 0) {
        console.log('Carregando anúncios do Google Ads na seção de resultados...');
        // Exemplo: Se você usa o AdSense, o código seria algo como:
        // (adsbygoogle = window.adsbygoogle || []).push({});
        // Ou se você tem um script de carregamento de anúncios específico:
        // seu_script_de_anuncios.carregarAnuncios();
        
        // IMPORTANTE: Certifique-se de que o código de anúncio real seja inserido aqui
        // e que ele só seja executado quando o elemento do anúncio estiver visível.
    } else {
        console.log('Seção de resultados não visível. Anúncios não carregados.');
    }
}

// Função para definir filtro ativo
function setActiveFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
}

// Função para aplicar filtro
function applyFilter(filter) {
    let filteredResults = [...currentResults];
    
    switch (filter) {
        case 'distance':
            filteredResults.sort((a, b) => a.distancia - b.distancia);
            break;
        case 'date':
            filteredResults.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        case 'all':
        default:
            // Manter ordem original
            break;
    }
    
    displayResults(filteredResults);
}

// Função para mostrar loading
function showLoading(withAddress = false) {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        if (withAddress && loadingAddress) {
            loadingAddress.textContent = 'Buscando endereço...';
        }
    }
}

// Função para esconder loading
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Função para configurar animações de scroll
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observar elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.step-card, .feature-card, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
}

