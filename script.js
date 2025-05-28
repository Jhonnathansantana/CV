document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu elements
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const mobileMenuContent = document.getElementById('mobile-menu-content');
            const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
            const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');

            // Desktop content area for scrolling
            const contentArea = document.querySelector('.content-area'); 
            const headerHeight = document.querySelector('header.lg\\:hidden')?.offsetHeight || 0;

            // Mobile menu toggle functionality
            if (mobileMenuToggle) { 
                mobileMenuToggle.addEventListener('click', function() {
                    mobileMenuContent.classList.remove('hidden'); 
                    mobileMenuOverlay.classList.remove('hidden'); 
                    setTimeout(function() {
                        mobileMenuContent.classList.add('open'); 
                        mobileMenuOverlay.classList.add('open'); 
                    }, 10);
                });
            }

            // Close mobile menu functionality (via overlay or nav link click)
            const closeMenu = function() {
                if (mobileMenuContent && mobileMenuOverlay) {
                    mobileMenuContent.classList.remove('open'); 
                    mobileMenuOverlay.classList.remove('open'); 
                    setTimeout(function() {
                        mobileMenuContent.classList.add('hidden'); 
                        mobileMenuOverlay.classList.add('hidden'); 
                    }, 300); 
                }
            };
            
            if (mobileMenuOverlay) {
                mobileMenuOverlay.addEventListener('click', closeMenu);
            }
            
            if (closeMobileMenuBtn) {
                closeMobileMenuBtn.addEventListener('click', closeMenu);
            }

            document.querySelectorAll('#mobile-menu-content a').forEach(function(item) {
                item.addEventListener('click', closeMenu);
            });


            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Active navigation link highlighting on scroll
            const sections = document.querySelectorAll('main section'); 
            const navLinks = document.querySelectorAll('.fixed-right-menu .nav-link, #mobile-menu-content .nav-link');
            
            function highlightNavLink() {
                let current = '';
                const scrollPos = contentArea ? contentArea.scrollTop : window.scrollY;

                sections.forEach(function(section) {
                    const sectionTop = section.offsetTop - headerHeight - 50; 
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    const hrefId = link.getAttribute('href').substring(1);
                    if (hrefId === current && link.getAttribute('href').startsWith('#')) {
                        link.classList.add('active');
                    }
                });
            }

            if (contentArea) { 
                contentArea.addEventListener('scroll', highlightNavLink);
            } else { 
                window.addEventListener('scroll', highlightNavLink);
            }
            highlightNavLink();


            // Smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') {
                        e.preventDefault(); 
                        return; 
                    }
                    if (targetId.startsWith('#')) {
                        e.preventDefault(); 
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop - headerHeight; 
                            if (contentArea) { 
                                contentArea.scrollTo({
                                    top: offsetTop,
                                    behavior: 'smooth'
                                });
                            } else { 
                                window.scrollTo({
                                    top: offsetTop,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }
                });
            });
            
            // Chart.js for Logros Cuantificables
            const logrosCtx = document.getElementById('logrosChart').getContext('2d');
            const logrosChart = new Chart(logrosCtx, {
                type: 'bar',
                data: {
                    labels: [
                        'Reducción Gastos Licenciamiento (%)', 
                        'Reducción Tiempo Escalamiento (%)', 
                        'Alertas Críticas Creadas (+)', 
                        'Dashboards Desarrollados (+)', 
                        'Dispositivos Optimizados (+)',
                        'Empresas Asesoradas (+)',
                        'Puntos de Red Habilitados (+)',
                        'Profesionales Capacitados (Seg. Info.) (+)'
                    ],
                    datasets: [{
                        label: 'Impacto y Logros',
                        data: [60, 80, 200, 10, 200, 10, 100, 50],
                        backgroundColor: [
                            'rgba(8, 70, 204, 0.8)',
                            'rgba(18, 80, 214, 0.8)',
                            'rgba(28, 90, 224, 0.8)',
                            'rgba(38, 100, 234, 0.8)',
                            'rgba(48, 110, 244, 0.8)',
                            'rgba(8, 70, 204, 0.6)',
                            'rgba(18, 80, 214, 0.6)',
                            'rgba(28, 90, 224, 0.6)'
                        ],
                        borderColor: [
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)',
                            'var(--color-pantone-blue)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'var(--color-text-dark)'
                            },
                            grid: {
                                color: '#e2e8f0'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'var(--color-text-dark)'
                            },
                            grid: {
                                display: false
                            },
                            callback: function(value, index, values) {
                                const label = this.getLabelForValue(value);
                                if (label.length > 15) {
                                    return label.match(/.{1,15}/g);
                                }
                                return label;
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: 'var(--color-text-dark)'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'var(--color-darkgrey)',
                            titleColor: 'var(--color-white)',
                            bodyColor: 'var(--color-white)',
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                        if (context.label.includes('%')) label += '%';
                                        if (context.label.includes('+')) label = '+' + label;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });

            // Gemini API Integration for Interview Questions
            const generateQuestionsBtn = document.getElementById('generate-questions-btn');
            const modalOverlay = document.getElementById('interview-questions-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const modalLoadingSpinner = document.getElementById('modal-loading-spinner');
            const modalQuestionsContent = document.getElementById('modal-questions-content');

            if (generateQuestionsBtn) { 
                generateQuestionsBtn.addEventListener('click', async function() {
                    modalOverlay.classList.remove('hidden');
                    modalLoadingSpinner.classList.remove('hidden');
                    modalQuestionsContent.innerHTML = ''; 

                    const professionalSummary = document.querySelector('#inicio p.hero-text').textContent.trim();
                    const experienceDetails = Array.from(document.querySelectorAll('#experiencia .card-portfolio .card-content')).map(function(card) { return card.textContent.trim(); }).join('\n\n');
                    const skills = Array.from(document.querySelectorAll('#habilidades .skill-tag')).map(function(tag) { return tag.textContent.trim(); }).join(', ');

                    const cvText = `Resumen Profesional: ${professionalSummary}\n\nExperiencia y Logros:\n${experienceDetails}\n\nHabilidades Clave: ${skills}`;

                    const prompt = `Actúa como un reclutador experimentado que está entrevistando a Jhonnathan De Jesús Araujo Santana para un puesto de liderazgo en TI. Basándote en su siguiente perfil profesional, experiencia y logros, genera 5 preguntas de entrevista de alto nivel que un reclutador real le haría. Enfócate en sus habilidades de liderazgo, resolución de problemas complejos, impacto medible y visión estratégica. Cada pregunta debe estar numerada y ser concisa.\n\nPerfil de Jhonnathan:\n${cvText}`;

                    try {
                        let chatHistory = [];
                        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                        const payload = { contents: chatHistory };
                        const apiKey = ""; 
                        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        const result = await response.json();

                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            const text = result.candidates[0].content.parts[0].text;
                            const questionsArray = text.split('\n').filter(function(line) { return line.trim() !== ''; });
                            
                            let htmlContent = '';
                            questionsArray.forEach(function(question) {
                                htmlContent += `<p class="mb-2 modal-question-item">${question}</p>`;
                            });
                            modalQuestionsContent.innerHTML = htmlContent;
                        } else {
                            modalQuestionsContent.innerHTML = '<p class="text-red-500">No se pudieron generar las preguntas. Inténtalo de nuevo más tarde.</p>';
                        }
                    } catch (error) {
                        console.error("Error al llamar a la API de Gemini:", error);
                        modalQuestionsContent.innerHTML = '<p class="text-red-500">Ocurrió un error al generar las preguntas. Por favor, verifica tu conexión.</p>';
                    } finally {
                        modalLoadingSpinner.classList.add('hidden');
                    }
                });
            }

            if (closeModalBtn) { 
                closeModalBtn.addEventListener('click', function() {
                    modalOverlay.classList.add('hidden');
                });
            }

            if (modalOverlay) { 
                modalOverlay.addEventListener('click', function(e) {
                    if (e.target === modalOverlay) {
                        modalOverlay.classList.add('hidden');
                    }
                });
            }

            // Gemini API Integration for Recommended Profiles
            const recommendedProfilesBtn = document.getElementById('recommended-profiles-btn');
            const profilesModalOverlay = document.getElementById('recommended-profiles-modal');
            const closeProfilesModalBtn = document.getElementById('close-profiles-modal-btn');
            const profilesModalLoadingSpinner = document.getElementById('profiles-modal-loading-spinner');
            const profilesModalContent = document.getElementById('profiles-modal-content');

            if (recommendedProfilesBtn) { 
                recommendedProfilesBtn.addEventListener('click', async function() {
                    profilesModalOverlay.classList.remove('hidden');
                    profilesModalLoadingSpinner.classList.remove('hidden');
                    profilesModalContent.innerHTML = ''; // Clear previous content

                    const professionalSummary = document.querySelector('#inicio p.hero-text').textContent.trim();
                    const experienceDetails = Array.from(document.querySelectorAll('#experiencia .card-portfolio .card-content')).map(function(card) { return card.textContent.trim(); }).join('\n\n');
                    const skills = Array.from(document.querySelectorAll('#habilidades .skill-tag')).map(function(tag) { return tag.textContent.trim(); }).join(', ');

                    const cvText = `Resumen Profesional: ${professionalSummary}\n\nExperiencia y Logros:\n${experienceDetails}\n\nHabilidades Clave: ${skills}`;

                    const prompt = `Actúa como un experto en reclutamiento y desarrollo de carrera. Basándote en el siguiente perfil profesional de Jhonnathan De Jesús Araujo Santana, sugiere 5 perfiles o roles profesionales altamente recomendados para él, considerando su experiencia en infraestructura, seguridad, consultoría y docencia en TI. Para cada perfil, proporciona una breve justificación de por qué es adecuado. Formato: Lista numerada de Perfil: Justificación.\n\nPerfil de Jhonnathan:\n${cvText}`;

                    try {
                        let chatHistory = [];
                        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                        const payload = { contents: chatHistory };
                        const apiKey = ""; 
                        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        const result = await response.json();

                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            const text = result.candidates[0].content.parts[0].text;
                            const profilesArray = text.split('\n').filter(function(line) { return line.trim() !== ''; });
                            
                            let htmlContent = '';
                            profilesArray.forEach(function(profile) {
                                htmlContent += `<p class="mb-2 modal-question-item">${profile}</p>`;
                            });
                            profilesModalContent.innerHTML = htmlContent;
                        } else {
                            profilesModalContent.innerHTML = '<p class="text-red-500">No se pudieron generar los perfiles. Inténtalo de nuevo más tarde.</p>';
                        }
                    } catch (error) {
                        console.error("Error al llamar a la API de Gemini para perfiles:", error);
                        profilesModalContent.innerHTML = '<p class="text-red-500">Ocurrió un error al generar los perfiles. Por favor, verifica tu conexión.</p>';
                    } finally {
                        profilesModalLoadingSpinner.classList.add('hidden');
                    }
                });
            }

            if (closeProfilesModalBtn) { 
                closeProfilesModalBtn.addEventListener('click', function() {
                    profilesModalOverlay.classList.add('hidden');
                });
            }

            if (profilesModalOverlay) { 
                profilesModalOverlay.addEventListener('click', function(e) {
                    if (e.target === profilesModalOverlay) {
                        profilesModalOverlay.classList.add('hidden');
                    }
                });
            }

            // Contact Me Modal functionality
            const contactMeBtn = document.getElementById('contact-me-btn');
            const contactModal = document.getElementById('contact-modal');
            const closeContactModalBtn = document.getElementById('close-contact-modal-btn');
            const contactForm = document.getElementById('contact-form');
            const contactFormLoadingSpinner = document.getElementById('contact-form-loading-spinner');
            const contactFormStatus = document.getElementById('contact-form-status');

            if (contactMeBtn) {
                contactMeBtn.addEventListener('click', function() {
                    contactModal.classList.remove('hidden');
                    contactFormStatus.classList.add('hidden'); 
                    contactFormStatus.textContent = '';
                    contactForm.reset(); 
                });
            }

            if (closeContactModalBtn) {
                closeContactModalBtn.addEventListener('click', function() {
                    contactModal.classList.add('hidden');
                });
            }

            if (contactModal) {
                contactModal.addEventListener('click', function(e) {
                    if (e.target === contactModal) {
                        contactModal.classList.add('hidden');
                    }
                    });
            }

            if (contactForm) {
                contactForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    contactFormLoadingSpinner.classList.remove('hidden');
                    contactFormStatus.classList.add('hidden');

                    const formData = new FormData(contactForm);
                    
                    try {
                        const response = await fetch("https://formspree.io/f/xnndleze", { 
                            method: "POST",
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            contactFormStatus.classList.remove('hidden');
                            contactFormStatus.classList.remove('error');
                            contactFormStatus.classList.add('success');
                            contactFormStatus.textContent = "¡Mensaje enviado con éxito! Te contactaré pronto.";
                            contactForm.reset();
                        } else {
                            const data = await response.json();
                            if (data.errors) {
                                contactFormStatus.textContent = data.errors.map(function(error) { return error.message; }).join(", ");
                            } else {
                                contactFormStatus.textContent = "¡Oops! Hubo un problema al enviar tu mensaje.";
                            }
                            contactFormStatus.classList.remove('hidden');
                            contactFormStatus.classList.remove('success');
                            contactFormStatus.classList.add('error');
                        }
                    } catch (error) {
                        contactFormStatus.classList.remove('hidden');
                        contactFormStatus.classList.remove('success');
                        contactFormStatus.classList.add('error');
                        contactFormStatus.textContent = "¡Oops! Hubo un error de red. Inténtalo de nuevo.";
                        console.error("Error submitting form:", error);
                    } finally {
                        contactFormLoadingSpinner.classList.add('hidden');
                        contactFormStatus.classList.remove('hidden');
                    }
                });
            }
        });