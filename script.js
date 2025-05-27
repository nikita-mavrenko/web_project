$(document).ready(() => {
    let slider = $('.slider')

    slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
        breakpoint: 768,
            settings: {
                arrows: false,
                slidesToShow: 1
            }
    });

    function updatePager() {
        let currentSlide = slider.slick('slickCurrentSlide') + 1;
        let totalSlides = slider.slick('getSlick').slideCount; 
        $('.current-page').text(currentSlide);
        $(".total-pages").text(" / " + totalSlides);
    }

    slider.on('afterChange', (event, slick, currentSlide) => {
        updatePager();
    });

    updatePager();

    const menuLinks = document.querySelectorAll(".scroll-to");
    console.log(menuLinks)
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(link)
            e.preventDefault();
            const sectionId = e.target.getAttribute('href'); 
            console.log(sectionId)
            $('html, body').animate({ 
                scrollTop: $(sectionId).offset().top-50 }, 
                500
            )
        });
    });

    const tarifs = document.querySelectorAll('.tarif__item');
    tarifs.forEach(tarif => {
        tarif.addEventListener('mouseenter', (e) => {
            tarifs.forEach(t => t.classList.remove("active"));

            e.currentTarget.classList.add("active");
        });
    });

    const burgerMenu = document.querySelector('.burger-menu');
    const menu = document.querySelector('.menu');

    document.addEventListener('click', (event) => {
        if (menu.classList.contains('active') && !menu.contains(event.target) && event.target !== burgerMenu) {
            menu.classList.remove('active');
        }
    });

    // Обработчик клика на бургер-меню
    burgerMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.classList.toggle('active'); 
    });

    function saveFormData() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            agreement: document.getElementById('agreement').checked
        };
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
    }
    function updateFormButtons(isLoggedIn) {
        const submitBtn = document.querySelector('.submit-btn');
        const btnlike = document.querySelector('.btnlike');
        const edbut = document.querySelector('.edbut');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (submitBtn) submitBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (btnlike) btnlike.style.display = isLoggedIn ? 'none' : 'inline-block';
        if (edbut) edbut.style.display = isLoggedIn ? 'inline-block' : 'none';
        if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
    }

    function loadFormData() {
        const savedData = localStorage.getItem('feedbackFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            document.getElementById('fullName').value = formData.fullName || '';
            document.getElementById('email').value = formData.email || '';
            document.getElementById('phone').value = formData.phone || '';
            document.getElementById('message').value = formData.message || '';
            document.getElementById('agreement').checked = formData.agreement || false;
        }
    }

    const feedbackForm = document.getElementById('contact');
    const responseMessage = document.getElementById('responseMessage');


    feedbackForm.onsubmit = async (event) => {
        event.preventDefault();
        console.log("sending form")
        const formData = new FormData(feedbackForm);
        const submitButton = document.querySelector('button[type="submit"]:focus');
        if (submitButton && submitButton.name === 'action') {
            formData.append(submitButton.name, submitButton.value);
        }
        const action = formData.get('action');
        
        // Сбрасываем сообщения
        document.querySelectorAll('.mess').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        try {
            const response = await fetch('index.php', {
                method: 'POST',
                body: formData,
                headers: {'X-Requested-With': 'XMLHttpRequest'}
            });
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
            const data = await response.json();

            console.log(data)

            if (data.logout) {
                window.location.href = 'index.php'; // Перезагружаем страницу после выхода
                return;
            }
        
            const messElement = document.querySelector('.mess');
            if (data.messages?.success && messElement) {
                messElement.textContent = data.messages.success;
                messElement.style.display = 'block';
            }

            if (!data.messages?.success && messElement) {
                messElement.textContent = data.messages.success;
                messElement.style.display = 'block';

            }
            
            const messInfo = document.querySelector('.mess_info');

            if (data.messages?.info && messInfo) {
                messInfo.innerHTML = data.messages.info;
                messInfo.style.display = 'block';
            }
            
            if (data.errors && data.messages) {
                for (const field in data.errors) {
                    const errorElement = document.querySelector(`.error[data-field="${field}"]`);
                    if (errorElement && data.messages[field]) {
                        errorElement.textContent = data.messages[field];
                    }
                } 
            }
            
            if (data.log) {
                updateFormButtons(data.log);
            }
        } catch (error) {
            console.error('Error:', error);
            const messElement = document.querySelector('.mess');
            if (messElement) {
                messElement.textContent = 'Ошибка при отправке формы';
                messElement.style.display = 'block';
            }
        }
    }


    loadFormData();
})