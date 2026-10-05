// Baza danych punktów i zadań gry miejskiej w Płocku
const gamePoints = [
    {
        id: 1,
        title: "Wzgórze Tumskie i Bazylika Katedralna",
        lat: 52.5435,
        lng: 19.6912,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/P%C5%82ock_Katedra_WS.jpg/800px-P%C5%82ock_Katedra_WS.jpg",
        description: "Najstarszy punkt Płocka o dużym znaczeniu historycznym. Spoczywają tu władcy Polski: Herman i Bolesław Krzywousty.",
        task: "Znajdź replikę Drzwi Płockich i odczytaj postać przedstawioną w prawym górnym kwaterze. Wpisz jej imię w systemie, aby zaliczyć zadanie."
    },
    {
        id: 2,
        title: "Pomnik Bolesława Krzywoustego",
        lat: 52.5442,
        lng: 19.6925,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pomnik_Boles%C5%82awa_Krzywoustego_w_P%C5%82ocku.jpg/800px-Pomnik_Boles%C5%82awa_Krzywoustego_w_P%C5%82ocku.jpg",
        description: "Monument upamiętniający jednego z najwybitniejszych polskich władców, księcia Mazowsza i polski.",
        task: "Policz liczbę mieczy widocznych w kompozycji pomnika i wpisz prawidłową cyfrę."
    },
    {
        id: 3,
        title: "Muzeum Mazowieckie w Płocku",
        lat: 52.5458,
        lng: 19.6940,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Muzeum_Mazowieckie_w_P%C5%82ocku_2021.jpg/800px-Muzeum_Mazowieckie_w_P%C5%82ocku_2021.jpg",
        description: "Nowoczesna placówka muzealna słynąca z najbogatszej w Polsce kolekcji sztuki secesyjnej.",
        task: "Znajdź na fasadzie budynku datę budowy lub ustanowienia instytucji i wskaż właściwy rok."
    },
    {
        id: 4,
        title: "Stary Rynek i Ratusz",
        lat: 52.5468,
        lng: 19.6910,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Plock_Stary_Rynek_Ratusz.jpg/800px-Plock_Stary_Rynek_Ratusz.jpg",
        description: "Historyczne serce Płocka z klasycystycznym budynkiem Ratusza z XIX wieku.",
        task: "O oznaczonej godzinie z wieży ratuszowej rozbrzmiewa hejnał. Jakie miasto partnerskie Płocka znajduje się najbliżej?"
    },
    {
        id: 5,
        title: "Park im. Tadeusza Kościuszki",
        lat: 52.5420,
        lng: 19.6885,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Plock_Park_Kosciuszki.jpg/800px-Plock_Park_Kosciuszki.jpg",
        description: "Malowniczy park miejski położony na skarpie wiślanej, doskonały punkt widokowy.",
        task: "Znajdź najstarszy dąb rosnący w alei głównej i oszacuj jego obwód za pomocą miarki lub kroków."
    }
];

let activePointId = 1;
let map;
let markers = {};

// Inicjalizacja aplikacji po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    initMap();
    renderSidebar();
    selectPoint(activePointId, false);
});

// Inicjalizacja mapy Leaflet wycentrowanej na Płocku
function initMap() {
    // Współrzędne centrum Płocka
    map = L.map('map').setView([52.5440, 19.6915], 15);

    // Otwarte i darmowe kafelki bazujące na OpenStreetMap (OpenStreetMap France)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Dodanie markerów dla każdego punktu gry
    gamePoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        
        marker.on('click', () => {
            selectPoint(point.id, true);
        });

        markers[point.id] = marker;
    });
}

// Renderowanie listy bocznej
function renderSidebar() {
    const scrollContainer = document.getElementById('points-scroll');
    scrollContainer.innerHTML = '';

    gamePoints.forEach(point => {
        const item = document.createElement('div');
        item.className = `point-item ${point.id === activePointId ? 'active' : ''}`;
        item.id = `sidebar-item-${point.id}`;
        
        item.innerHTML = `
            <div class="point-number">${point.id}</div>
            <img src="${point.image}" alt="${point.title}" class="point-thumb">
            <div class="point-info">
                <h3>${point.id}. ${point.title}</h3>
            </div>
        `;

        item.addEventListener('click', () => {
            selectPoint(point.id, true);
        });

        scrollContainer.appendChild(item);
    });
}

// Wybór aktywnego punktu (aktualizuje listę, panel środkowy oraz mapę)
function selectPoint(id, panMap = true) {
    activePointId = id;
    const point = gamePoints.find(p => p.id === id);

    // Aktualizacja klas aktywności na liście
    document.querySelectorAll('.point-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`sidebar-item-${id}`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Renderowanie panelu szczegółów zadania
    const taskContent = document.getElementById('task-content');
    taskContent.innerHTML = `
        <div class="task-card-header">
            <h2>${point.id}. ${point.title}</h2>
        </div>
        <img src="${point.image}" alt="${point.title}" class="task-image">
        <div class="task-description">
            <p><strong>Informacje historyczne:</strong> ${point.description}</p>
        </div>
        <div class="task-action-box">
            <h4>Zadanie do wykonania:</h4>
            <p>${point.task}</p>
            <button class="check-answer-btn" onclick="alert('Zadanie dla punktu ${point.id} zostało oznaczone jako ukończone!')">Potwierdź wykonanie</button>
        </div>
    `;

    // Przesunięcie mapy na wybraną lokalizację
    if (panMap && map) {
        map.setView([point.lat, point.lng], 16, { animate: true });
        if (markers[id]) {
            markers[id].openPopup();
        }
    }
}