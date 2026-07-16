/*

Tooplate 2163 Spectrum
https://www.tooplate.com/view/2163-spectrum
Free HTML CSS Template

*/

(function () {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header border on scroll
    var header = document.getElementById('siteHeader');
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Mobile menu
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('menuOverlay');

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        overlay.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        overlay.classList.toggle('visible', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Accordion
    var items = document.querySelectorAll('.acc-item');
    items.forEach(function (item) {
        var trigger = item.querySelector('.acc-trigger');
        var panel = item.querySelector('.acc-panel');
        trigger.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            items.forEach(function (other) {
                other.classList.remove('open');
                other.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
                other.querySelector('.acc-panel').style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    // Geometric divider: rotate shapes based on scroll velocity
    var shapes = document.querySelectorAll('.geo-shape');
    if (!prefersReduced && shapes.length) {
        var lastScroll = window.scrollY;
        var velocity = 0;
        var rotations = [];
        shapes.forEach(function () { rotations.push(0); });

        window.addEventListener('scroll', function () {
            var now = window.scrollY;
            velocity += (now - lastScroll);
            lastScroll = now;
        }, { passive: true });

        function tickGeo() {
            velocity *= 0.9;
            shapes.forEach(function (shape, i) {
                var speed = parseFloat(shape.getAttribute('data-speed')) || 1;
                rotations[i] += velocity * speed * 0.05;
                var box = shape.getBBox();
                var cx = box.x + box.width / 2;
                var cy = box.y + box.height / 2;
                shape.setAttribute('transform', 'rotate(' + rotations[i].toFixed(2) + ' ' + cx + ' ' + cy + ')');
            });
            requestAnimationFrame(tickGeo);
        }
        requestAnimationFrame(tickGeo);
    }

    // Hero product carousel: fade and rotate through slides, shift panel color
    var stage = document.getElementById('heroStage');
    var carousel = document.getElementById('heroCarousel');
    var dotsWrap = document.getElementById('heroDots');
    if (stage && carousel) {
        var slides = carousel.querySelectorAll('.hero-slide');
        var current = 0;
        var timer = null;
        var delay = 3800;

        // Build dots
        slides.forEach(function (slide, i) {
            var dot = document.createElement('button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Show product ' + (i + 1));
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () {
                goTo(i);
                restart();
            });
            dotsWrap.appendChild(dot);
        });
        var dots = dotsWrap.querySelectorAll('button');

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
            stage.style.background = slides[current].getAttribute('data-accent');
        }

        function next() { goTo(current + 1); }

        function start() {
            if (prefersReduced) return;
            timer = setInterval(next, delay);
        }
        function stop() { clearInterval(timer); }
        function restart() { stop(); start(); }

        // Pause on hover for control
        stage.addEventListener('mouseenter', stop);
        stage.addEventListener('mouseleave', start);

        start();
    }

    // Contact form: basic validation and confirmation
    var form = document.getElementById('contactForm');
    if (form) {
        var status = document.getElementById('formStatus');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.querySelector('#cf-name').value.trim();
            var email = form.querySelector('#cf-email').value.trim();
            var message = form.querySelector('#cf-message').value.trim();
            var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !validEmail || !message) {
                status.textContent = 'Add your name, a valid email, and a message to send.';
                status.classList.add('error');
                return;
            }
            status.classList.remove('error');
            status.textContent = 'Thanks ' + name + ', your message is on its way.';
            form.reset();
        });
    }

    // Scroll reveals with iframe-safe fallback
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { observer.observe(el); });
    }

    setTimeout(function () {
        reveals.forEach(function (el) { el.classList.add('revealed'); });
    }, 3000);
})();
