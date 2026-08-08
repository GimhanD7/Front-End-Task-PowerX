// ========================================
// MOCK DATA
// ========================================
const courses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp 2024",
        instructor: "Anuradha Jayakody",
        category: "Web Development",
        progress: 85,
        completedActivities: 102,
        totalActivities: 120,
        image: "images/Web Development.jpg"
    },
    {
        id: 2,
        title: "Python for Data Science and Machine Learning",
        instructor: "Thamali Senarathna",
        category: "Programming",
        progress: 100,
        completedActivities: 85,
        totalActivities: 85,
        image: "images/Web Development.png"
    },
    {
        id: 3,
        title: "UI/UX Design Masterclass",
        instructor: "Padma Ranjani",
        category: "UI/UX Design",
        progress: 32,
        completedActivities: 15,
        totalActivities: 48,
        image: "images/UX Design.jpg"
    },
    {
        id: 4,
        title: "Advanced React and Next.js",
        instructor: "Vihara Senasingha",
        category: "Web Development",
        progress: 15,
        completedActivities: 5,
        totalActivities: 35,
        image: "images/Programming.jpg"
    },
 
];

// ========================================
// DOM ELEMENTS
// ========================================
const courseContainer = document.getElementById('courseContainer');
const courseCountElement = document.getElementById('courseCount');
const emptyState = document.getElementById('emptyState');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// Controls
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// Summary Metrics
const enrolledCountEl = document.getElementById('enrolledCount');
const completedCountEl = document.getElementById('completedCount');
const overallProgressEl = document.getElementById('overallProgress');
const overallProgressBar = document.getElementById('overallProgressBar');

// Modal Elements
const modalOverlay = document.getElementById('courseModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCourseImage = document.getElementById('modalCourseImage');
const modalCategory = document.getElementById('modalCategory');
const modalCourseTitle = document.getElementById('modalCourseTitle');
const modalInstructor = document.getElementById('modalInstructor');
const modalDescription = document.getElementById('modalDescription');
const modalProgress = document.getElementById('modalProgress');
const modalProgressBar = document.getElementById('modalProgressBar');
const modalActivities = document.getElementById('modalActivities');

// Theme & Header
const darkModeBtn = document.getElementById('darkModeBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set dynamic dates
    setCurrentDate();
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }

    // Initialize Dashboard
    calculateSummaryMetrics();
    renderCourses(courses);

    // Set up Event Listeners
    setupEventListeners();
});

// ========================================
// CORE FUNCTIONS
// ========================================

function setCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = today;
}

function calculateSummaryMetrics() {
    const enrolled = courses.length;
    const completed = courses.filter(course => course.progress === 100).length;
    
    // Calculate average progress
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
    const averageProgress = enrolled > 0 ? Math.round(totalProgress / enrolled) : 0;

    // Animate numbers (simple implementation)
    enrolledCountEl.textContent = enrolled;
    completedCountEl.textContent = completed;
    
    // Animate overall progress
    setTimeout(() => {
        overallProgressEl.textContent = averageProgress;
        overallProgressBar.style.width = `${averageProgress}%`;
    }, 100);
}

function renderCourses(coursesToRender) {
    // Update count
    courseCountElement.textContent = coursesToRender.length;

    // Clear container
    courseContainer.innerHTML = '';

    if (coursesToRender.length === 0) {
        courseContainer.style.display = 'none';
        emptyState.classList.add('active');
        return;
    }

    courseContainer.style.display = 'grid'; // Reset from empty state
    emptyState.classList.remove('active');

    // Generate Cards
    coursesToRender.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.id = course.id; // Store ID for modal click

        card.innerHTML = `
            <div class="course-image-wrapper">
                <img src="${course.image}" alt="${course.title}" loading="lazy">
                <span class="category-badge">${course.category}</span>
            </div>
            
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                
                <div class="course-instructor">
                    <i class="fa-solid fa-user-tie"></i>
                    <span>${course.instructor}</span>
                </div>
                
                <div class="course-footer">
                    <div class="progress-info">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    
                    <div class="card-progress-bar">
                        <div class="card-progress-fill" style="width: 0%;" data-target-width="${course.progress}%"></div>
                    </div>
                </div>
            </div>
        `;

        courseContainer.appendChild(card);
    });

    // Trigger progress bar animations after a slight delay for DOM insertion
    setTimeout(() => {
        const progressFills = courseContainer.querySelectorAll('.card-progress-fill');
        progressFills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-target-width');
        });
    }, 50);
}

// ========================================
// FILTERING & SEARCH
// ========================================

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;

    let filtered = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) || 
                              course.instructor.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || course.category === category;
        
        return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    if (sort === 'high') {
        filtered.sort((a, b) => b.progress - a.progress);
    } else if (sort === 'low') {
        filtered.sort((a, b) => a.progress - b.progress);
    }

    renderCourses(filtered);
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Filter controls
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    // Clear filters button
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = 'all';
        sortFilter.value = 'default';
        applyFilters();
    });

    // Dark Mode Toggle
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        updateDarkModeIcon(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Course Card Clicks (Event Delegation)
    courseContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.course-card');
        if (card) {
            const courseId = parseInt(card.dataset.id);
            openModal(courseId);
        }
    });

    // Modal Close
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle inline display for simplicity without adding new CSS classes
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = '';
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '4.5rem';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.backgroundColor = 'var(--bg-surface)';
            navMenu.style.padding = '1rem';
            navMenu.style.boxShadow = 'var(--shadow-md)';
            navMenu.style.zIndex = '99';
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    });
}

// Helper for dark mode icon
function updateDarkModeIcon(isDark) {
    const icon = darkModeBtn.querySelector('i');
    if (isDark) {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// ========================================
// MODAL LOGIC
// ========================================

function openModal(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Populate Data
    modalCourseImage.src = course.image;
    modalCourseImage.alt = course.title;
    modalCategory.textContent = course.category;
    modalCourseTitle.textContent = course.title;
    modalInstructor.textContent = course.instructor;
    
    // Generate a mock description based on title
    modalDescription.textContent = `Dive deep into ${course.title} with expert instruction from ${course.instructor}. This comprehensive course covers everything you need to know to master the subject and advance your career.`;

    modalProgress.textContent = course.progress;
    modalActivities.textContent = `${course.completedActivities} of ${course.totalActivities} activities completed`;

    // Reset progress bar to 0 before animating
    modalProgressBar.style.width = '0%';

    // Show Modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Animate progress bar
    setTimeout(() => {
        modalProgressBar.style.width = `${course.progress}%`;
    }, 100);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}
