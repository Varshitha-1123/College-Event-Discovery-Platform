// CampusConnect - College Event Discovery Platform
// Main Application JavaScript

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');
const sections = document.querySelectorAll('.dashboard-section');
const filterButtons = document.querySelectorAll('.filter-btn');
const eventsGrid = document.getElementById('eventsGrid');
const allEventsContainer = document.getElementById('allEventsContainer');
const viewButtons = document.querySelectorAll('.view-btn');
const clubsContainer = document.getElementById('clubsContainer');
const clubsDirectory = document.getElementById('clubsDirectory');
const categoryButtons = document.querySelectorAll('.category-btn');
const calendarBody = document.getElementById('calendarBody');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const currentMonthEl = document.getElementById('currentMonth');
const registeredEventsEl = document.getElementById('registeredEvents');
const eventForm = document.getElementById('eventForm');
const previewEventBtn = document.getElementById('previewEventBtn');
const notificationsContainer = document.getElementById('notificationsContainer');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const eventModal = document.getElementById('eventModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBody = document.getElementById('modalBody');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const sortSelect = document.getElementById('sortSelect');
const eventsCountEl = document.getElementById('eventsCount');
const clubsCountEl = document.getElementById('clubsCount');
const studentsCountEl = document.getElementById('studentsCount');

// State
let events = [];
let clubs = [];
let notifications = [];
let registeredEventIds = [1, 2, 5]; // IDs of events user is registered for
let currentDate = new Date();
let currentView = 'grid'; // 'grid' or 'list'
let currentFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Set today's date in the create event form
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('eventDate').value = formattedDate;
    
    // Set default time to next hour
    const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
    const formattedTime = nextHour.getHours().toString().padStart(2, '0') + ':00';
    document.getElementById('eventTime').value = formattedTime;
    
    // Load sample data
    loadSampleData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial content
    renderEvents();
    renderAllEvents();
    renderFeaturedClubs();
    renderClubsDirectory();
    renderCalendar();
    renderRegisteredEvents();
    renderNotifications();
    
    // Update stats
    updateStats();
    
    // Set current month
    updateMonthDisplay();
});

// Load sample data
function loadSampleData() {
    // Sample events data
    events = [
        {
            id: 1,
            title: "Annual Tech Conference",
            category: "conference",
            description: "Join us for the biggest tech event of the year! Featuring talks from industry leaders, workshops on emerging technologies, and networking opportunities with top tech companies. This is a must-attend event for anyone interested in the future of technology.",
            date: getFutureDate(5),
            time: "09:00",
            duration: 360,
            location: "University Auditorium",
            club: "cs-club",
            clubName: "Computer Science Club",
            capacity: 300,
            registered: 245,
            tags: ["technology", "networking", "career"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 2,
            title: "Startup Pitch Competition",
            category: "career",
            description: "Got a business idea? Pitch it to a panel of investors and win up to $10,000 in seed funding. Open to all students with innovative startup ideas. Finalists will receive mentorship from successful entrepreneurs.",
            date: getFutureDate(8),
            time: "14:00",
            duration: 180,
            location: "Business School, Room 101",
            club: "entrepreneurship",
            clubName: "Entrepreneurship Club",
            capacity: 150,
            registered: 89,
            tags: ["business", "pitching", "funding"],
            requirements: ["Business plan"],
            isCancelled: false
        },
        {
            id: 3,
            title: "International Food Festival",
            category: "cultural",
            description: "Taste cuisine from around the world! Student cultural organizations will be serving dishes from their home countries. Live music and dance performances throughout the day. Come hungry and ready to explore global flavors!",
            date: getFutureDate(10),
            time: "11:00",
            duration: 480,
            location: "Main Quad",
            club: "",
            clubName: "International Student Association",
            capacity: 500,
            registered: 320,
            tags: ["food", "culture", "international"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 4,
            title: "Machine Learning Workshop",
            category: "workshop",
            description: "Hands-on workshop introducing machine learning concepts using Python and TensorFlow. No prior experience required. Bring your laptop! We'll cover basics of neural networks and build a simple image classifier.",
            date: getFutureDate(12),
            time: "13:00",
            duration: 120,
            location: "Engineering Building, Lab 304",
            club: "ai-club",
            clubName: "AI & Robotics Club",
            capacity: 40,
            registered: 38,
            tags: ["AI", "programming", "workshop"],
            requirements: ["Laptop", "Python installed"],
            isCancelled: false
        },
        {
            id: 5,
            title: "Basketball Championship Finals",
            category: "sports",
            description: "Come cheer for our university team as they compete for the conference championship title! Free admission for students with ID. Concessions available. Let's pack the arena and show our school spirit!",
            date: getFutureDate(15),
            time: "19:00",
            duration: 150,
            location: "University Arena",
            club: "",
            clubName: "Athletics Department",
            capacity: 2000,
            registered: 1875,
            tags: ["sports", "basketball", "championship"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 6,
            title: "Meditation & Mindfulness Session",
            category: "workshop",
            description: "Take a break from studying and join us for a guided meditation session. Learn techniques to reduce stress and improve focus. Perfect for finals week preparation. Mats provided, just bring yourself!",
            date: getFutureDate(16),
            time: "17:00",
            duration: 60,
            location: "Wellness Center, Room 12",
            club: "",
            clubName: "Mindfulness Club",
            capacity: 30,
            registered: 22,
            tags: ["wellness", "meditation", "stress-relief"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 7,
            title: "Debate: AI Ethics in Society",
            category: "academic",
            description: "Join the debate on ethical considerations of artificial intelligence. Teams will argue for and against increased regulation of AI development. Audience Q&A session following the formal debate.",
            date: getFutureDate(18),
            time: "16:00",
            duration: 90,
            location: "Humanities Building, Auditorium",
            club: "debate-club",
            clubName: "Debate Society",
            capacity: 200,
            registered: 134,
            tags: ["debate", "ethics", "AI"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 8,
            title: "Dance Collective Performance",
            category: "cultural",
            description: "Our talented dance collective presents their fall showcase featuring hip-hop, contemporary, and cultural dance styles. Special guest performance by alumni now dancing professionally.",
            date: getFutureDate(20),
            time: "19:30",
            duration: 120,
            location: "Performing Arts Center",
            club: "dance-club",
            clubName: "Dance Collective",
            capacity: 400,
            registered: 389,
            tags: ["dance", "performance", "arts"],
            requirements: [],
            isCancelled: false
        },
        {
            id: 9,
            title: "Career Fair Preparation Workshop",
            category: "career",
            description: "Get ready for the upcoming career fair! Learn how to create an effective resume, practice elevator pitches, and get tips for networking with recruiters. Bring your resume for review.",
            date: getFutureDate(3),
            time: "15:00",
            duration: 90,
            location: "Career Center, Main Hall",
            club: "",
            clubName: "Career Services",
            capacity: 100,
            registered: 76,
            tags: ["career", "resume", "networking"],
            requirements: ["Resume (optional)"],
            isCancelled: false
        },
        {
            id: 10,
            title: "Environmental Cleanup Day",
            category: "service",
            description: "Join fellow students in cleaning up campus and surrounding areas. Gloves and bags provided. Community service hours available. Let's work together to keep our campus beautiful!",
            date: getFutureDate(7),
            time: "10:00",
            duration: 180,
            location: "Meet at Student Union",
            club: "environment",
            clubName: "Environmental Club",
            capacity: 80,
            registered: 45,
            tags: ["service", "environment", "community"],
            requirements: [],
            isCancelled: false
        }
    ];

    // Sample clubs data
    clubs = [
        {
            id: "cs-club",
            name: "Computer Science Club",
            category: "academic",
            description: "For students interested in programming, software development, and technology. Weekly workshops and hackathons. Open to all skill levels.",
            members: 120,
            icon: "fas fa-laptop-code",
            president: "Sarah Chen",
            email: "csclub@university.edu",
            meetingTime: "Thursdays, 6 PM"
        },
        {
            id: "debate-club",
            name: "Debate Society",
            category: "academic",
            description: "Develop public speaking and critical thinking skills through competitive debate tournaments. No experience necessary - we teach all skills needed.",
            members: 45,
            icon: "fas fa-comments",
            president: "Michael Rodriguez",
            email: "debate@university.edu",
            meetingTime: "Mondays, 7 PM"
        },
        {
            id: "ai-club",
            name: "AI & Robotics Club",
            category: "academic",
            description: "Explore artificial intelligence, machine learning, and robotics through hands-on projects. Work on research and compete in national competitions.",
            members: 85,
            icon: "fas fa-robot",
            president: "David Kim",
            email: "airobotics@university.edu",
            meetingTime: "Wednesdays, 5 PM"
        },
        {
            id: "dance-club",
            name: "Dance Collective",
            category: "arts",
            description: "Open to all dance enthusiasts. Multiple styles including hip-hop, contemporary, and cultural dances. Performances each semester.",
            members: 60,
            icon: "fas fa-music",
            president: "Jessica Williams",
            email: "dance@university.edu",
            meetingTime: "Tuesdays & Fridays, 8 PM"
        },
        {
            id: "entrepreneurship",
            name: "Entrepreneurship Club",
            category: "academic",
            description: "Connect with aspiring entrepreneurs, attend startup workshops, and develop business ideas. Pitch competitions and investor networking events.",
            members: 95,
            icon: "fas fa-chart-line",
            president: "Alex Johnson",
            email: "entrepreneurs@university.edu",
            meetingTime: "Mondays, 6:30 PM"
        },
        {
            id: "environment",
            name: "Environmental Club",
            category: "service",
            description: "Promote sustainability on campus through initiatives, cleanups, and educational events. Help make our campus greener!",
            members: 70,
            icon: "fas fa-leaf",
            president: "Maria Garcia",
            email: "environment@university.edu",
            meetingTime: "Thursdays, 5 PM"
        },
        {
            id: "photography",
            name: "Photography Club",
            category: "arts",
            description: "For photography enthusiasts of all skill levels. Photo walks, workshops, and exhibitions. Camera rentals available for members.",
            members: 50,
            icon: "fas fa-camera",
            president: "Kevin Lee",
            email: "photography@university.edu",
            meetingTime: "Sundays, 2 PM"
        },
        {
            id: "soccer-club",
            name: "Soccer Club",
            category: "sports",
            description: "Recreational and competitive soccer for all skill levels. Regular practices and inter-college matches. Both men's and women's teams.",
            members: 65,
            icon: "fas fa-futbol",
            president: "James Wilson",
            email: "soccer@university.edu",
            meetingTime: "MWF, 4 PM (Practice)"
        },
        {
            id: "film-club",
            name: "Film Society",
            category: "arts",
            description: "Screen and discuss classic and contemporary films. Host filmmaker Q&As and produce short films. Equipment training provided.",
            members: 40,
            icon: "fas fa-film",
            president: "Olivia Martin",
            email: "film@university.edu",
            meetingTime: "Fridays, 7 PM"
        },
        {
            id: "pre-med",
            name: "Pre-Med Society",
            category: "academic",
            description: "For students pursuing medical careers. MCAT prep, guest speakers from medical schools, and volunteer opportunities.",
            members: 110,
            icon: "fas fa-stethoscope",
            president: "Robert Taylor",
            email: "premed@university.edu",
            meetingTime: "Tuesdays, 6 PM"
        }
    ];

    // Sample notifications data
    notifications = [
        {
            id: 1,
            title: "Event Reminder: Tech Conference Tomorrow",
            message: "Don't forget about the Annual Tech Conference happening tomorrow at 9:00 AM in the University Auditorium.",
            time: "2 hours ago",
            type: "event",
            read: false,
            eventId: 1
        },
        {
            id: 2,
            title: "You've been added to AI & Robotics Club",
            message: "Welcome to the club! Check out our upcoming workshop on machine learning this Wednesday.",
            time: "1 day ago",
            type: "club",
            read: false,
            clubId: "ai-club"
        },
        {
            id: 3,
            title: "Event Registration Confirmed",
            message: "You're registered for the Startup Pitch Competition on " + formatDate(getFutureDate(8)) + ".",
            time: "2 days ago",
            type: "registration",
            read: true,
            eventId: 2
        },
        {
            id: 4,
            title: "New Event: Meditation Session",
            message: "A new meditation and mindfulness session has been added to events. Perfect for stress relief during midterms!",
            time: "3 days ago",
            type: "event",
            read: true,
            eventId: 6
        },
        {
            id: 5,
            title: "Club Meeting Rescheduled",
            message: "The Computer Science Club meeting has been moved to Thursday at 5 PM in the Engineering Building.",
            time: "5 days ago",
            type: "club",
            read: true,
            clubId: "cs-club"
        },
        {
            id: 6,
            title: "Event Capacity Almost Full",
            message: "The Machine Learning Workshop is almost at capacity (38/40 spots). Register soon if you want to attend!",
            time: "1 week ago",
            type: "event",
            read: true,
            eventId: 4
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section id
            let targetId;
            if (this.id.includes('mobile')) {
                targetId = this.id.replace('mobile', '').replace('Link', 'Section');
            } else {
                targetId = this.id.replace('Link', 'Section');
            }
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            
            // Special handling for calendar section
            if (targetId === 'calendarSection') {
                renderCalendar();
            }
        });
    });

    // Footer links
    document.querySelectorAll('.footer-column a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkId = this.id;
            if (linkId.includes('Events')) {
                document.getElementById('eventsLink').click();
            } else if (linkId.includes('Clubs')) {
                document.getElementById('clubsLink').click();
            } else if (linkId.includes('Create')) {
                document.getElementById('createLink').click();
            } else if (linkId.includes('Calendar')) {
                document.getElementById('calendarLink').click();
            }
        });
    });

    // Filter buttons for events
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            renderEvents(currentFilter);
        });
    });

    // View toggle buttons (grid/list)
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            allEventsContainer.className = `events-container ${currentView}-view`;
            renderAllEvents();
        });
    });

    // Sort select
    sortSelect.addEventListener('change', function() {
        renderAllEvents();
    });

    // Category filter for clubs
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            renderClubsDirectory(category);
        });
    });

    // Calendar navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthDisplay();
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthDisplay();
        renderCalendar();
    });

    // Event form submission
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createNewEvent();
    });

    // Preview event button
    previewEventBtn.addEventListener('click', function() {
        previewEvent();
    });

    // Mark all notifications as read
    markAllReadBtn.addEventListener('click', function() {
        markAllNotificationsRead();
    });

    // Modal close button
    modalCloseBtn.addEventListener('click', function() {
        eventModal.classList.remove('active');
    });

    // Close modal when clicking outside
    eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            eventModal.classList.remove('active');
        }
    });

    // Search button
    searchBtn.addEventListener('click', function() {
        performSearch();
    });

    // Search on enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Render events on home page
function renderEvents(filter = 'all') {
    eventsGrid.innerHTML = '';
    
    let filteredEvents = events;
    
    // Apply filter if not 'all'
    if (filter !== 'all') {
        filteredEvents = events.filter(event => event.category === filter);
    }
    
    // Sort by date (closest first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take only the first 6 events for home page
    const eventsToShow = filteredEvents.slice(0, 6);
    
    if (eventsToShow.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-events">
                <h3>No events found</h3>
                <p>Try selecting a different category or check back later for new events.</p>
            </div>
        `;
        return;
    }
    
    eventsToShow.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Render all events on events page
function renderAllEvents() {
    allEventsContainer.innerHTML = '';
    
    let sortedEvents = [...events];
    
    // Apply sorting
    const sortBy = sortSelect.value;
    if (sortBy === 'date') {
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popularity') {
        sortedEvents.sort((a, b) => b.registered - a.registered);
    } else if (sortBy === 'name') {
        sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    if (sortedEvents.length === 0) {
        allEventsContainer.innerHTML = `
            <div class="no-events">
                <h3>No events found</h3>
                <p>Check back later for upcoming events or create your own!</p>
            </div>
        `;
        return;
    }
    
    sortedEvents.forEach(event => {
        const eventCard = createEventCard(event);
        allEventsContainer.appendChild(eventCard);
    });
}

// Create an event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-id', event.id);
    
    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = formatDate(event.date);
    
    // Format time for display
    const timeString = event.time;
    const [hours, minutes] = timeString.split(':');
    const formattedTime = formatTime(hours, minutes);
    
    // Get category info
    const categoryInfo = getCategoryInfo(event.category);
    
    // Check if user is registered
    const isRegistered = registeredEventIds.includes(event.id);
    
    // Check if event is upcoming (within next 7 days)
    const today = new Date();
    const eventDay = new Date(event.date);
    const daysUntil = Math.ceil((eventDay - today) / (1000 * 60 * 60 * 24));
    const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
    
    card.innerHTML = `
        <div class="event-image" style="background-color: ${getCategoryColor(event.category, 0.1)}; color: ${getCategoryColor(event.category)}">
            <i class="${getEventIcon(event.category)}"></i>
            ${isUpcoming ? '<div class="upcoming-badge">Soon!</div>' : ''}
        </div>
        <div class="event-content">
            <span class="event-category category-${event.category}">${categoryInfo.name}</span>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <div class="event-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-clock"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
            <div class="event-footer">
                <div class="event-club">
                    <i class="fas fa-users"></i>
                    <span>${event.clubName || 'University Event'}</span>
                </div>
                <div class="event-actions">
                    <button class="${isRegistered ? 'registered' : ''}" data-id="${event.id}">
                        ${isRegistered ? 'Registered' : 'Register'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add click event to the card
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on the register button
        if (!e.target.closest('.event-actions button')) {
            showEventDetails(event.id);
        }
    });
    
    // Add event listener to register button
    const registerBtn = card.querySelector('.event-actions button');
    registerBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click event
        toggleEventRegistration(event.id);
    });
    
    return card;
}

// Render featured clubs
function renderFeaturedClubs() {
    clubsContainer.innerHTML = '';
    
    // Take first 4 clubs as featured
    const featuredClubs = clubs.slice(0, 4);
    
    if (featuredClubs.length === 0) {
        clubsContainer.innerHTML = `
            <div class="no-events">
                <p>No clubs available at the moment.</p>
            </div>
        `;
        return;
    }
    
    featuredClubs.forEach(club => {
        const clubCard = createClubCard(club);
        clubsContainer.appendChild(clubCard);
    });
}

// Render clubs directory
function renderClubsDirectory(filter = 'all') {
    clubsDirectory.innerHTML = '';
    
    let filteredClubs = clubs;
    
    // Apply filter if not 'all'
    if (filter !== 'all') {
        filteredClubs = clubs.filter(club => club.category === filter);
    }
    
    if (filteredClubs.length === 0) {
        clubsDirectory.innerHTML = `
            <div class="no-events">
                <h3>No clubs found</h3>
                <p>Try selecting a different category.</p>
            </div>
        `;
        return;
    }
    
    filteredClubs.forEach(club => {
        const clubCard = createClubCard(club);
        clubsDirectory.appendChild(clubCard);
    });
}

// Create club card element
function createClubCard(club) {
    const card = document.createElement('div');
    card.className = 'club-card';
    
    // Check if user is a member (simulated - always false initially)
    const isMember = false;
    
    card.innerHTML = `
        <div class="club-icon">
            <i class="${club.icon}"></i>
        </div>
        <h3 class="club-name">${club.name}</h3>
        <p class="club-description">${club.description}</p>
        <div class="club-members">
            <i class="fas fa-user-friends"></i>
            <span>${club.members} members</span>
        </div>
        <div class="club-details">
            <div class="club-detail">
                <i class="fas fa-user-tie"></i>
                <span>${club.president}</span>
            </div>
            <div class="club-detail">
                <i class="fas fa-clock"></i>
                <span>${club.meetingTime}</span>
            </div>
        </div>
        <button class="join-club-btn ${isMember ? 'joined' : ''}" data-id="${club.id}">
            ${isMember ? 'Joined' : 'Join Club'}
        </button>
    `;
    
    // Add event listeners to join buttons
    const joinBtn = card.querySelector('.join-club-btn');
    joinBtn.addEventListener('click', function() {
        const clubId = this.getAttribute('data-id');
        toggleClubMembership(clubId);
    });
    
    return card;
}

// Render calendar
function renderCalendar() {
    calendarBody.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    // Get total days in month
    const daysInMonth = lastDay.getDate();
    
    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarBody.appendChild(emptyDay);
    }
    
    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Find events on this day
        const dayEvents = events.filter(event => event.date === dateString);
        
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            ${dayEvents.map(event => `
                <div class="day-event ${event.category}" title="${event.title}" data-id="${event.id}">
                    ${event.title.substring(0, 15)}${event.title.length > 15 ? '...' : ''}
                </div>
            `).join('')}
        `;
        
        // Highlight today
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.style.backgroundColor = 'var(--primary-light)';
            dayElement.style.borderColor = 'var(--primary)';
        }
        
        calendarBody.appendChild(dayElement);
    }
    
    // Add event listeners to day events
    document.querySelectorAll('.day-event').forEach(eventElement => {
        eventElement.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-id'));
            showEventDetails(eventId);
        });
    });
}

// Render registered events
function renderRegisteredEvents() {
    registeredEventsEl.innerHTML = '';
    
    const registeredEvents = events.filter(event => registeredEventIds.includes(event.id));
    
    if (registeredEvents.length === 0) {
        registeredEventsEl.innerHTML = `
            <div class="no-events">
                <p>You haven't registered for any events yet.</p>
                <p>Browse events and click "Register" to join.</p>
            </div>
        `;
        return;
    }
    
    registeredEvents.forEach(event => {
        // Format date for display
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Format time
        const [hours, minutes] = event.time.split(':');
        const formattedTime = formatTime(hours, minutes);
        
        const eventElement = document.createElement('div');
        eventElement.className = 'registered-event';
        eventElement.innerHTML = `
            <div class="event-info">
                <h4>${event.title}</h4>
                <p>${formattedDate} • ${formattedTime} • ${event.location}</p>
            </div>
            <button class="unregister-btn" data-id="${event.id}">Unregister</button>
        `;
        
        registeredEventsEl.appendChild(eventElement);
    });
    
    // Add event listeners to unregister buttons
    document.querySelectorAll('.unregister-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-id'));
            toggleEventRegistration(eventId);
        });
    });
}

// Render notifications
function renderNotifications() {
    notificationsContainer.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="no-events">
                <p>No notifications yet.</p>
            </div>
        `;
        return;
    }
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
        
        // Get icon based on notification type
        let icon = 'fas fa-bell';
        if (notification.type === 'event') icon = 'fas fa-calendar';
        if (notification.type === 'club') icon = 'fas fa-users';
        if (notification.type === 'registration') icon = 'fas fa-check-circle';
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        
        notificationsContainer.appendChild(notificationElement);
        
        // Add click event to mark as read
        notificationElement.addEventListener('click', function() {
            if (!notification.read) {
                notification.read = true;
                renderNotifications();
                
                // Update badge count
                updateNotificationBadge();
            }
            
            // If notification is about an event or club, navigate to it
            if (notification.eventId) {
                showEventDetails(notification.eventId);
            } else if (notification.clubId) {
                // Navigate to clubs section
                document.getElementById('clubsLink').click();
            }
        });
    });
}

// Show event details in modal
function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) {
        showNotification("Event not found", "error");
        return;
    }
    
    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    });
    
    // Format time for display
    const timeString = event.time;
    const [hours, minutes] = timeString.split(':');
    const formattedTime = formatTime(hours, minutes);
    
    // Calculate end time
    const endTime = new Date(eventDate);
    endTime.setMinutes(endTime.getMinutes() + event.duration);
    const formattedEndTime = endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    
    // Get category info
    const categoryInfo = getCategoryInfo(event.category);
    
    // Check if user is registered
    const isRegistered = registeredEventIds.includes(event.id);
    
    // Calculate spots left
    const spotsLeft = event.capacity - event.registered;
    
    modalBody.innerHTML = `
        <div class="event-detail-header">
            <div class="event-detail-image" style="background-color: ${getCategoryColor(event.category, 0.1)}; color: ${getCategoryColor(event.category)}">
                <i class="${getEventIcon(event.category)}"></i>
            </div>
            <div class="event-detail-title">
                <h2>${event.title}</h2>
                <span class="event-category category-${event.category}">${categoryInfo.name}</span>
            </div>
        </div>
        
        <div class="event-detail-meta">
            <div class="meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${formattedTime} - ${formattedEndTime}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-users"></i>
                <span>${event.clubName || 'University Event'}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-user-check"></i>
                <span>${event.registered} registered • ${spotsLeft > 0 ? spotsLeft + ' spots left' : 'Full'}</span>
            </div>
        </div>
        
        <div class="event-description">
            <h3>Description</h3>
            <p>${event.description}</p>
            
            ${event.requirements && event.requirements.length > 0 ? `
                <h3 style="margin-top: 20px;">Requirements</h3>
                <ul>
                    ${event.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${event.tags && event.tags.length > 0 ? `
                <div class="event-tags" style="margin-top: 20px;">
                    ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
        
        <div class="event-actions-modal">
            <button class="btn-primary ${isRegistered ? 'registered' : ''}" id="modalRegisterBtn" data-id="${event.id}">
                ${isRegistered ? 'Unregister from Event' : 'Register for Event'}
            </button>
            <button class="btn-secondary" id="shareEventBtn">
                <i class="fas fa-share"></i> Share Event
            </button>
            ${event.club ? `<button class="btn-secondary" id="viewClubBtn">
                <i class="fas fa-users"></i> View Club
            </button>` : ''}
        </div>
    `;
    
    // Add event listener to register button in modal
    const modalRegisterBtn = document.getElementById('modalRegisterBtn');
    modalRegisterBtn.addEventListener('click', function() {
        toggleEventRegistration(event.id);
        eventModal.classList.remove('active');
    });
    
    // Add event listener to share button
    const shareBtn = document.getElementById('shareEventBtn');
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: `Check out this event: ${event.title} on ${formattedDate}`,
                url: window.location.href,
            })
            .catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`${event.title} - ${formattedDate} at ${formattedTime} - ${event.location}`);
            showNotification("Event details copied to clipboard!", "success");
        }
    });
    
    // Add event listener to view club button
    const viewClubBtn = document.getElementById('viewClubBtn');
    if (viewClubBtn) {
        viewClubBtn.addEventListener('click', function() {
            eventModal.classList.remove('active');
            document.getElementById('clubsLink').click();
        });
    }
    
    // Show modal
    eventModal.classList.add('active');
}

// Toggle event registration
function toggleEventRegistration(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const eventIndex = registeredEventIds.indexOf(eventId);
    
    if (eventIndex === -1) {
        // Check if event is full
        if (event.registered >= event.capacity) {
            showNotification("This event is already full!", "error");
            return;
        }
        
        // Register for event
        registeredEventIds.push(eventId);
        event.registered++;
        
        // Show success notification
        showNotification(`Successfully registered for "${event.title}"!`, "success");
        
        // Add notification
        addNotification({
            title: "Event Registration Confirmed",
            message: `You're now registered for "${event.title}" on ${formatDate(event.date)}.`,
            type: "registration",
            eventId: eventId
        });
    } else {
        // Unregister from event
        registeredEventIds.splice(eventIndex, 1);
        event.registered = Math.max(0, event.registered - 1);
        
        // Show notification
        showNotification(`Unregistered from "${event.title}"`, "info");
    }
    
    // Update UI
    renderEvents(currentFilter);
    renderAllEvents();
    renderCalendar();
    renderRegisteredEvents();
    updateStats();
    
    // Update all register buttons
    document.querySelectorAll('.event-actions button, #modalRegisterBtn').forEach(button => {
        if (parseInt(button.getAttribute('data-id')) === eventId) {
            if (registeredEventIds.includes(eventId)) {
                button.textContent = 'Registered';
                button.classList.add('registered');
                if (button.id === 'modalRegisterBtn') {
                    button.textContent = 'Unregister from Event';
                }
            } else {
                button.textContent = 'Register';
                button.classList.remove('registered');
                if (button.id === 'modalRegisterBtn') {
                    button.textContent = 'Register for Event';
                }
            }
        }
    });
}

// Toggle club membership
function toggleClubMembership(clubId) {
    const button = document.querySelector(`.join-club-btn[data-id="${clubId}"]`);
    const club = clubs.find(c => c.id === clubId);
    
    if (!club) return;
    
    if (button.classList.contains('joined')) {
        // Leave club
        button.classList.remove('joined');
        button.textContent = 'Join Club';
        club.members--;
        
        showNotification(`You've left ${club.name}.`, "info");
    } else {
        // Join club
        button.classList.add('joined');
        button.textContent = 'Joined';
        club.members++;
        
        // Show success notification
        showNotification(`Welcome to ${club.name}!`, "success");
        
        // Add notification
        addNotification({
            title: `Joined ${club.name}`,
            message: `Welcome to ${club.name}! Check out their upcoming events and meetings.`,
            type: "club",
            clubId: clubId
        });
    }
    
    // Update stats
    updateStats();
}

// Create new event
function createNewEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const category = document.getElementById('eventCategory').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const duration = parseInt(document.getElementById('eventDuration').value);
    const location = document.getElementById('eventLocation').value.trim();
    const club = document.getElementById('eventClub').value;
    const description = document.getElementById('eventDescription').value.trim();
    const capacity = document.getElementById('eventCapacity').value;
    const imageUrl = document.getElementById('eventImage').value.trim();
    
    // Validation
    if (!title || !category || !date || !time || !location || !description) {
        showNotification("Please fill in all required fields.", "error");
        return;
    }
    
    // Check if date is in the future
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
        showNotification("Event date must be in the future.", "error");
        return;
    }
    
    // Generate new event ID
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    
    // Find club name if club is selected
    let clubName = '';
    if (club) {
        const clubData = clubs.find(c => c.id === club);
        if (clubData) clubName = clubData.name;
    }
    
    // Create new event object
    const newEvent = {
        id: newId,
        title: title,
        category: category,
        description: description,
        date: date,
        time: time,
        duration: duration,
        location: location,
        club: club,
        clubName: clubName,
        capacity: capacity ? parseInt(capacity) : 100,
        registered: 0,
        tags: getTagsForCategory(category),
        requirements: [],
        isCancelled: false
    };
    
    // Add to events array
    events.unshift(newEvent);
    
    // Reset form
    eventForm.reset();
    
    // Set default values again
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().split('T')[0];
    document.getElementById('eventDate').value = formattedDate;
    
    const nextHour = new Date(todayDate.getTime() + 60 * 60 * 1000);
    const formattedTime = nextHour.getHours().toString().padStart(2, '0') + ':00';
    document.getElementById('eventTime').value = formattedTime;
    document.getElementById('eventDuration').value = "60";
    
    // Show success message
    showNotification(`Event "${title}" created successfully!`, "success");
    
    // Update UI
    renderEvents(currentFilter);
    renderAllEvents();
    renderCalendar();
    updateStats();
    
    // Add notification about new event
    addNotification({
        title: "Event Created Successfully",
        message: `Your event "${title}" is now live on CampusConnect.`,
        type: "event",
        eventId: newId
    });
    
    // Navigate to events page
    document.getElementById('eventsLink').click();
}

// Preview event
function previewEvent() {
    const title = document.getElementById('eventTitle').value;
    
    if (!title) {
        showNotification("Please enter an event title to preview.", "error");
        return;
    }
    
    // Create a temporary event object for preview
    const tempEvent = {
        id: 999,
        title: title || "Sample Event",
        category: document.getElementById('eventCategory').value || "conference",
        description: document.getElementById('eventDescription').value || "This is a sample event description.",
        date: document.getElementById('eventDate').value || new Date().toISOString().split('T')[0],
        time: document.getElementById('eventTime').value || "14:00",
        duration: parseInt(document.getElementById('eventDuration').value) || 60,
        location: document.getElementById('eventLocation').value || "Sample Location",
        club: document.getElementById('eventClub').value || "",
        clubName: document.getElementById('eventClub').value ? 
            document.getElementById('eventClub').options[document.getElementById('eventClub').selectedIndex].text : 
            "University Event",
        capacity: document.getElementById('eventCapacity').value || 100,
        registered: 0,
        tags: [],
        requirements: [],
        isCancelled: false
    };
    
    // Show the event in modal as preview
    const event = tempEvent;
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
    });
    
    const [hours, minutes] = event.time.split(':');
    const formattedTime = formatTime(hours, minutes);
    
    const endTime = new Date(eventDate);
    endTime.setMinutes(endTime.getMinutes() + event.duration);
    const formattedEndTime = endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    
    const categoryInfo = getCategoryInfo(event.category);
    
    modalBody.innerHTML = `
        <div class="event-detail-header">
            <div class="event-detail-image" style="background-color: ${getCategoryColor(event.category, 0.1)}; color: ${getCategoryColor(event.category)}">
                <i class="${getEventIcon(event.category)}"></i>
                <div style="position: absolute; bottom: 10px; background: var(--warning); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">
                    PREVIEW
                </div>
            </div>
            <div class="event-detail-title">
                <h2>${event.title}</h2>
                <span class="event-category category-${event.category}">${categoryInfo.name} • PREVIEW</span>
            </div>
        </div>
        
        <div class="event-detail-meta">
            <div class="meta-item">
                <i class="fas fa-calendar"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${formattedTime} - ${formattedEndTime}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-users"></i>
                <span>${event.clubName}</span>
            </div>
        </div>
        
        <div class="event-description">
            <h3>Description</h3>
            <p>${event.description}</p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: var(--primary-light); border-radius: 8px; border-left: 4px solid var(--primary);">
                <h4 style="margin-top: 0; color: var(--primary);"><i class="fas fa-info-circle"></i> This is a preview</h4>
                <p style="margin-bottom: 0; color: var(--dark);">Your event will look like this to other users. Click "Create Event" to publish it.</p>
            </div>
        </div>
        
        <div class="event-actions-modal">
            <button class="btn-secondary" id="closePreviewBtn">
                <i class="fas fa-times"></i> Close Preview
            </button>
            <button class="btn-primary" id="createFromPreviewBtn">
                <i class="fas fa-check"></i> Create Event Now
            </button>
        </div>
    `;
    
    // Add event listener to close preview button
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    closePreviewBtn.addEventListener('click', function() {
        eventModal.classList.remove('active');
    });
    
    // Add event listener to create from preview button
    const createFromPreviewBtn = document.getElementById('createFromPreviewBtn');
    createFromPreviewBtn.addEventListener('click', function() {
        eventModal.classList.remove('active');
        eventForm.requestSubmit();
    });
    
    // Show modal
    eventModal.classList.add('active');
}

// Mark all notifications as read
function markAllNotificationsRead() {
    let hasUnread = false;
    
    notifications.forEach(notification => {
        if (!notification.read) {
            notification.read = true;
            hasUnread = true;
        }
    });
    
    if (hasUnread) {
        renderNotifications();
        updateNotificationBadge();
        showNotification("All notifications marked as read.", "success");
    }
}

// Add notification
function addNotification(notificationData) {
    const newNotification = {
        id: notifications.length + 1,
        title: notificationData.title,
        message: notificationData.message,
        time: 'Just now',
        type: notificationData.type,
        read: false
    };
    
    // Add eventId or clubId if provided
    if (notificationData.eventId) {
        newNotification.eventId = notificationData.eventId;
    }
    if (notificationData.clubId) {
        newNotification.clubId = notificationData.clubId;
    }
    
    notifications.unshift(newNotification);
    
    // Limit to 20 notifications
    if (notifications.length > 20) {
        notifications.pop();
    }
    
    renderNotifications();
    updateNotificationBadge();
}

// Update notification badge count
function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badgeElements = document.querySelectorAll('.badge');
    
    badgeElements.forEach(badge => {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Update month display
function updateMonthDisplay() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    currentMonthEl.textContent = `${monthName} ${year}`;
}

// Update stats
function updateStats() {
    // Count events happening in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
    });
    
    // Count total clubs
    const totalClubs = clubs.length;
    
    // Estimate total students (simulated)
    const totalStudents = 1250 + Math.floor(Math.random() * 200);
    
    // Update DOM elements
    eventsCountEl.textContent = upcomingEvents.length;
    clubsCountEl.textContent = totalClubs;
    studentsCountEl.textContent = totalStudents.toLocaleString();
}

// Perform search
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        showNotification("Please enter a search term.", "error");
        return;
    }
    
    // Navigate to events section
    document.getElementById('eventsLink').click();
    
    // Filter events based on search query
    const searchResults = events.filter(event => {
        return (
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            (event.clubName && event.clubName.toLowerCase().includes(query)) ||
            event.category.toLowerCase().includes(query)
        );
    });
    
    // Display search results
    allEventsContainer.innerHTML = '';
    
    if (searchResults.length === 0) {
        allEventsContainer.innerHTML = `
            <div class="no-events">
                <h3>No events found for "${query}"</h3>
                <p>Try searching with different keywords.</p>
            </div>
        `;
        return;
    }
    
    // Show search header
    const searchHeader = document.createElement('div');
    searchHeader.className = 'search-results-header';
    searchHeader.innerHTML = `
        <h3>Search Results for "${query}" (${searchResults.length} events found)</h3>
        <button class="btn-secondary" id="clearSearchBtn">Clear Search</button>
    `;
    allEventsContainer.parentElement.insertBefore(searchHeader, allEventsContainer);
    
    // Add event listener to clear search button
    document.getElementById('clearSearchBtn').addEventListener('click', function() {
        searchInput.value = '';
        renderAllEvents();
        this.parentElement.remove();
    });
    
    // Display search results
    searchResults.forEach(event => {
        const eventCard = createEventCard(event);
        allEventsContainer.appendChild(eventCard);
    });
}

// Show notification
function showNotification(message, type = "success") {
    notificationText.textContent = message;
    
    // Set color based on type
    if (type === "success") {
        notification.style.backgroundColor = "var(--success)";
    } else if (type === "error") {
        notification.style.backgroundColor = "var(--danger)";
    } else if (type === "info") {
        notification.style.backgroundColor = "var(--primary)";
    } else if (type === "warning") {
        notification.style.backgroundColor = "var(--warning)";
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Helper functions
function getFutureDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(hours, minutes) {
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getCategoryInfo(category) {
    const categories = {
        "academic": { name: "Academic", color: "#1565C0" },
        "social": { name: "Social", color: "#7B1FA2" },
        "career": { name: "Career", color: "#2E7D32" },
        "sports": { name: "Sports", color: "#EF6C00" },
        "cultural": { name: "Cultural", color: "#C2185B" },
        "workshop": { name: "Workshop", color: "#006064" },
        "conference": { name: "Conference", color: "#4527A0" },
        "service": { name: "Service", color: "#5D4037" }
    };
    
    return categories[category] || { name: "Event", color: "#4361EE" };
}

function getCategoryColor(category, alpha = 1) {
    const color = getCategoryInfo(category).color;
    
    if (alpha === 1) return color;
    
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getEventIcon(category) {
    const icons = {
        "academic": "fas fa-graduation-cap",
        "social": "fas fa-users",
        "career": "fas fa-briefcase",
        "sports": "fas fa-running",
        "cultural": "fas fa-globe-americas",
        "workshop": "fas fa-chalkboard-teacher",
        "conference": "fas fa-microphone",
        "service": "fas fa-hands-helping"
    };
    
    return icons[category] || "fas fa-calendar-alt";
}

function getTagsForCategory(category) {
    const tags = {
        "academic": ["learning", "education", "lecture"],
        "social": ["networking", "fun", "meetup"],
        "career": ["professional", "networking", "jobs"],
        "sports": ["fitness", "competition", "team"],
        "cultural": ["diversity", "arts", "international"],
        "workshop": ["hands-on", "skills", "training"],
        "conference": ["speakers", "networking", "professional"],
        "service": ["volunteer", "community", "helping"]
    };
    
    return tags[category] || ["event", "campus"];
}

// Initialize club details in style
const style = document.createElement('style');
style.textContent = `
    .club-details {
        margin-bottom: 15px;
    }
    
    .club-detail {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: var(--gray);
        margin-bottom: 5px;
    }
    
    .club-detail i {
        width: 14px;
        color: var(--primary);
    }
    
    .upcoming-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--accent);
        color: white;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    
    .event-image {
        position: relative;
    }
    
    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid var(--primary-light);
    }
    
    .search-results-header h3 {
        margin: 0;
        color: var(--primary);
    }
    
    .event-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .tag {
        background-color: var(--primary-light);
        color: var(--primary);
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);