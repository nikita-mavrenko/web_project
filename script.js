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


    feedbackForm.onsubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(feedbackForm);
        fetch('https://formcarry.com/s/xCAxz_RE3dU', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                responseMessage.textContent = 'Спасибо за ваше сообщение!';
            } else {
                responseMessage.textContent = 'Произошла ошибка. Пожалуйста, попробуйте еще раз.';
            }
            feedbackForm.reset();
            clearFormData();
        })
    }
    function clearFormData() {
        localStorage.removeItem('feedbackFormData');
    }

    loadFormData();
})