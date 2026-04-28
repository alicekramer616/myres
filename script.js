// 1. ГЛОБАЛЬНЫЕ ФУНКЦИИ (доступны сразу для onclick в HTML)
window.openTab = function(evt, tabName) {
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    document.querySelectorAll(".tab-content").forEach(c => { 
        c.style.display = "none"; 
        c.classList.remove("active-content"); 
    });
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    
    const selected = document.getElementById(tabName);
    if (selected) {
        selected.style.display = "block";
        const title = selected.querySelector('.typing-title');
        if (title) { 
            title.classList.remove('typing-animation'); 
            void title.offsetWidth; 
            title.classList.add('typing-animation'); 
        }
        setTimeout(() => selected.classList.add("active-content"), 10);
        
        // АНИМАЦИЯ НАВЫКОВ (Полосы + Круг)
        if (tabName === 'skills') {
            // 1. Анимация линейных полос
            document.querySelectorAll('.skill-progress-fill').forEach(bar => {
                const percent = bar.getAttribute('data-percent'); 
                bar.style.transition = 'none'; 
                bar.style.width = '0%'; 
                setTimeout(() => { 
                    bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.42, 0.41, 1)'; 
                    bar.style.width = percent + '%'; 
                }, 50);
            });

            // 2. Анимация кругового индикатора (Self-management)
            document.querySelectorAll('.special-skill-center .percent-fill').forEach(circle => {
                const parent = circle.closest('.progress-circle');
                const percent = parent.style.getPropertyValue('--percent') || 90;
                const offset = 339.29 - (339.29 * percent) / 100;
                circle.style.transition = 'none';
                circle.style.strokeDashoffset = '339.29';
                setTimeout(() => {
                    circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
                    circle.style.strokeDashoffset = offset;
                }, 100);
            });
        }
    }
    
    if (evt) evt.currentTarget.classList.add("active");
    else document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");
};

window.scrollToPage = function(pageIndex) {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    scrollContainer.scrollTo({ 
        top: pageIndex * scrollContainer.clientHeight, 
        behavior: 'smooth' 
    });
};
// 2. ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const dots = document.querySelectorAll('.nav-dot');
    const upArrow = document.getElementById('upArrow');
    const downArrow = document.getElementById('downArrow');
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    let isAnimating = false;

    // 3. ЛОГИКА СКРОЛЛА (Колесо мыши)
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        if (isAnimating) return;
        
        const currentPg = Math.round(scrollContainer.scrollTop / scrollContainer.clientHeight);
        const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
        const activeBtn = document.querySelector('.tab-btn.active');
        const currentIndex = tabButtons.indexOf(activeBtn);
        
        if (e.deltaY > 0) {
            if (currentPg === 0 && currentIndex < tabButtons.length - 1) { 
                window.openTab(null, tabButtons[currentIndex + 1].dataset.tab); 
                isAnimating = true; 
                setTimeout(() => isAnimating = false, 500); 
            }
            else if (currentPg < 1) window.scrollToPage(1);
        } else {
            if (currentPg === 1) window.scrollToPage(0);
            else if (currentPg === 0 && currentIndex > 0) { 
                window.openTab(null, tabButtons[currentIndex - 1].dataset.tab); 
                isAnimating = true; 
                setTimeout(() => isAnimating = false, 500); 
            }
        }
    }, { passive: false });

    // 4. ИНДИКАТОР ПРОГРЕССА И СТРЕЛКИ
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop;
        const height = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (progressBar) progressBar.style.width = (scrollTop / height * 100) + "%";
        
        const currentPg = Math.round(scrollTop / scrollContainer.clientHeight);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPg));
        
        if (upArrow && downArrow) {
            if (currentPg === 0) { 
                upArrow.style.opacity = "0"; 
                downArrow.style.opacity = "1"; 
            } else { 
                upArrow.style.opacity = "1"; 
                downArrow.style.opacity = "0"; 
            }
        }
    });

    // 5. КАСТОМНЫЙ КУРСОР (Движение)
    window.addEventListener('mousemove', (e) => {
        if (dot && outline) {
            dot.style.left = outline.style.left = e.clientX + 'px';
            dot.style.top = outline.style.top = e.clientY + 'px';
        }
    });

    // 6. ЭФФЕКТ НАВЕДЕНИЯ
    const hoverElements = 'a, button, .photo-container, .tab-btn, .detail-card, .soft-card, .nav-dot, .nav-arrow, .contact-list li, .scroll-hint-text';
    document.querySelectorAll(hoverElements).forEach(el => {
        el.addEventListener('mouseenter', () => outline?.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => outline?.classList.remove('cursor-hover'));
    });
}); // Конец DOMContentLoaded
