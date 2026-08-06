document.addEventListener("DOMContentLoaded", function () {
    // -------------------------------------------------------------
    // 1. GLOBAL / HELPER FUNCTIONS
    // -------------------------------------------------------------
    const backTop = document.querySelector("#back-top");

    /**
     * Helper dùng chung để khởi tạo danh sách Swiper
     */
    function initSwipers(containerSelector, slideSelector, options = {}) {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach((container) => {
            const slider = container.querySelector(slideSelector);
            if (!slider) return;

            const next = container.querySelector(".swiper-button-next");
            const prev = container.querySelector(".swiper-button-prev");
            const pagi = container.querySelector(".swiper-pagination");

            new Swiper(slider, {
                slidesPerView: options.slidesPerView || 1,
                spaceBetween: options.spaceBetween ?? 10,
                slidesPerGroup: options.slidesPerGroup || 1,
                navigation: {
                    nextEl: next || null,
                    prevEl: prev || null,
                },
                pagination: pagi ? { el: pagi, clickable: true } : false,
                breakpoints: options.breakpoints || {},
            });
        });
    }

    // -------------------------------------------------------------
    // 2. EXPLUS SLIDER (WINDOW SCOPE)
    // -------------------------------------------------------------
    function initExplusSliders() {
        const explusSliderElements = document.querySelectorAll('.explus_slider');
        explusSliderElements.forEach((slider) => {
            const show = parseFloat(slider.getAttribute('data-show')) || 1;
            const isVertical = slider.getAttribute('data-vertical') === 'true';
            
            let dimension = isVertical ? slider.offsetHeight : slider.offsetWidth;
            slider.dataset.width = dimension;
            
            const itemDimension = dimension / show;
            const sliderListItems = slider.querySelectorAll('.slider_list .item');
            
            sliderListItems.forEach((item) => {
                if (isVertical) {
                    item.style.height = `${itemDimension}px`;
                } else {
                    item.style.width = `${itemDimension}px`;
                }
            });
        });
    }

    window.explus_slider = function (e, page = 1) {
        if (!e) return;
        const activeElements = e.parentElement?.querySelectorAll('.active') || [];
        activeElements.forEach((el) => el.classList.remove('active'));
        e.classList.add('active');

        const s = e.closest('.explus_slider');
        if (!s) return;

        const show = parseFloat(s.getAttribute('data-show')) || 1;
        const width = parseFloat(s.getAttribute('data-width')) / show;
        const sliderList = s.querySelector('.slider_list');

        if (!sliderList) return;

        if (s.getAttribute('data-vertical') === 'true') {
            sliderList.scrollTop = width * page;
        } else {
            sliderList.scrollLeft = width * page;
        }
    };

    window.explus_slider_prev = function (e) {
        const s = e.closest('.explus_slider');
        if (!s) return;

        const show = parseInt(s.getAttribute('data-show'), 10) || 1;
        let page = parseInt(s.getAttribute('data-page'), 10) || 0;

        if (page > 0) {
            page -= show;
            s.dataset.page = page;
            window.explus_slider(e, page);
        }
    };

    window.explus_slider_next = function (e) {
        const s = e.closest('.explus_slider');
        if (!s) return;

        const show = parseInt(s.getAttribute('data-show'), 10) || 1;
        let page = parseInt(s.getAttribute('data-page'), 10) || 0;
        const total = (parseInt(s.getAttribute('data-item'), 10) || 0) / show;

        if (page <= total) {
            page += show;
            s.dataset.page = page;
            window.explus_slider(e, page);
        }
    };

    // -------------------------------------------------------------
    // 3. UI HANDLERS
    // -------------------------------------------------------------
    function handleChangeTab() {
        const changTabs = document.querySelectorAll('.js__changeTab');
        changTabs.forEach((changTab) => {
            const tabs = changTab.querySelectorAll(".js__tabItem");
            const panes = changTab.querySelectorAll(".js__tabPane");

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', function () {
                    const activeTab = changTab.querySelector('.js__tabItem.active');
                    const activePane = changTab.querySelector('.js__tabPane.active');

                    if (activeTab) activeTab.classList.remove('active');
                    if (activePane) activePane.classList.remove('active');

                    this.classList.add('active');
                    if (panes[index]) panes[index].classList.add('active');
                });
            });
        });
    }

    function handleVideo_16x9() {
        const video169s = document.querySelectorAll(".js__video169");
        video169s.forEach((video169) => {
            const videos = video169.querySelectorAll("iframe");
            videos.forEach((video) => {
                const w = video.offsetWidth;
                video.style.height = `${(w * 9) / 16}px`;
            });
        });
    }

    function handleNavbarMb() {
        const navbarMb = document.querySelector(".js__navbarMenuMb");
        if (!navbarMb) return;

        const container = navbarMb.querySelector(".js__navbarMb");
        const scrollBtn = navbarMb.querySelector(".js__navbarIcon");

        if (!container || !scrollBtn) return;

        let scrollPosition = 0;

        scrollBtn.addEventListener("click", function () {
            const scrollDistance = 100;
            let scrollAmount = scrollPosition + scrollDistance;
            scrollAmount = Math.min(scrollAmount, container.scrollWidth - container.clientWidth);

            container.scrollTo({ left: scrollAmount, behavior: "smooth" });
            scrollPosition = scrollAmount;
        });
    }

    function handleMoreMenu() {
        const navbarMoreIcon = document.querySelector('.js__navbarMoreIcon');
        const navbarMoreContent = document.querySelector('.js__navbarMoreContent');
        if (!navbarMoreIcon || !navbarMoreContent) return;

        navbarMoreIcon.addEventListener('click', function () {
            this.classList.toggle('active');
            navbarMoreContent.classList.toggle('active');
        });
    }

    function handleShowSubMenu() {
        const subMenu = document.querySelector(".js__clickShowMenuMb");
        if (!subMenu) return;

        const closeSubMenu = document.querySelector(".js__closeSubMenu");
        const overlay = document.querySelector(".js__overlay");
        const parentBox = subMenu.parentElement;

        const closeMenu = () => {
            if (parentBox) parentBox.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        subMenu.addEventListener('click', function () {
            if (parentBox) parentBox.classList.add("active");
            document.body.style.overflow = "hidden";
        });

        if (closeSubMenu) closeSubMenu.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);
    }

    function handleShowDropdownSubMenu() {
        const dropdownSubMenu = document.querySelectorAll(".js__dropDown");
        dropdownSubMenu.forEach((item) => {
            const parent = item.parentElement;
            const nextEle = parent?.parentElement?.querySelector(".js__listSubMenu");

            if (!parent || !nextEle) return;

            item.addEventListener('click', function () {
                parent.classList.toggle("active");
                nextEle.style.maxHeight = nextEle.style.maxHeight ? null : `${nextEle.scrollHeight}px`;
            });
        });
    }

    function handleShowSearchMb() {
        const searchMbs = document.querySelectorAll(".js__searchMb");
        const closeSearchMb = document.querySelector(".js__closeSearchMb");
        const formSearchMb = document.querySelector(".js__formSearchMb");
        const focusElement = formSearchMb?.querySelector(".js__focusSearchMb");

        if (!formSearchMb) return;

        searchMbs.forEach((searchMb) => {
            searchMb.addEventListener('click', () => {
                formSearchMb.classList.add("active");
                if (focusElement) focusElement.focus();
            });
        });

        if (closeSearchMb) {
            closeSearchMb.addEventListener('click', () => {
                formSearchMb.classList.remove("active");
                if (focusElement) focusElement.value = "";
            });
        }
    }

    function handleShowPopupLogin() {
        const showPopupLogins = document.querySelectorAll(".js__showPopupLogin");
        const popupLoginContainer = document.querySelector(".js__popupLoginContainer");

        if (!popupLoginContainer || showPopupLogins.length === 0) return;

        const popupLogin = popupLoginContainer.querySelector(".js__popupLogin");
        const closePopupLogin = popupLoginContainer.querySelector(".js__closePopupLogin");
        const overlay = popupLoginContainer.querySelector(".js__overlay");
        const loginContainerForm = document.querySelector(".js__loginContainerForm");

        const resetForms = () => {
            document.body.style.overflow = "auto";
            if (popupLogin) popupLogin.classList.remove('active');
            if (overlay) overlay.classList.remove('active');

            if (loginContainerForm) {
                const loginForm = loginContainerForm.querySelector('.js__loginForm');
                const registerForm = loginContainerForm.querySelector('.js__registerForm');
                const forgotForm = loginContainerForm.querySelector('.js__forgotForm');

                if (loginForm) loginForm.classList.add('active');
                if (registerForm) registerForm.classList.remove('active');
                if (forgotForm) forgotForm.classList.remove('active');
            }
        };

        showPopupLogins.forEach((showPopupLogin) => {
            showPopupLogin.addEventListener('click', () => {
                if (popupLogin) popupLogin.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = "hidden";
            });
        });

        if (closePopupLogin) closePopupLogin.addEventListener('click', resetForms);
        if (overlay) overlay.addEventListener('click', resetForms);

        if (loginContainerForm) {
            const loginForm = loginContainerForm.querySelector('.js__loginForm');
            const registerForm = loginContainerForm.querySelector('.js__registerForm');
            const forgotForm = loginContainerForm.querySelector('.js__forgotForm');

            const loginBtn = registerForm?.querySelector('.js__loginBtn');
            const registerBtn = loginForm?.querySelector('.js__registerBtn');
            const forgotBtn = loginForm?.querySelector('.js__forgotBtn');

            if (registerBtn) {
                registerBtn.addEventListener('click', () => {
                    loginForm?.classList.remove('active');
                    registerForm?.classList.add('active');
                    forgotForm?.classList.remove('active');
                });
            }

            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    registerForm?.classList.remove('active');
                    loginForm?.classList.add('active');
                });
            }

            if (forgotBtn) {
                forgotBtn.addEventListener('click', () => {
                    loginForm?.classList.remove('active');
                    forgotForm?.classList.add('active');
                });
            }
        }
    }

    function handleCollapse() {
        const collapseContainers = document.querySelectorAll('.js__collapseContainer');
        let activeItem = null;

        collapseContainers.forEach((collapseContainer) => {
            const collapse = collapseContainer.querySelector('.js__collapse');
            if (!collapse) return;

            collapse.addEventListener('click', () => {
                if (activeItem === collapseContainer) {
                    collapseContainer.classList.remove('active');
                    activeItem = null;
                } else {
                    if (activeItem) activeItem.classList.remove('active');
                    collapseContainer.classList.add('active');
                    activeItem = collapseContainer;
                }
            });
        });
    }

    function handleShowDropdown() {
        const dropdownContainers = document.querySelectorAll(".js__dropdownContainer");

        dropdownContainers.forEach((dropdownContainer) => {
            const dropdown = dropdownContainer.querySelector(".js__showDropdown");
            const dropdownContent = dropdownContainer.querySelector(".js__dropdownContent");
            const overlay = dropdownContainer.querySelector(".js__overlay");

            if (!dropdown || !dropdownContent) return;

            dropdown.addEventListener('click', () => {
                dropdownContent.classList.toggle("active");
                if (overlay) overlay.classList.add('active');
            });

            if (overlay) {
                overlay.addEventListener('click', function () {
                    dropdownContent.classList.remove("active");
                    this.classList.remove("active");
                });
            }
        });
    }

    function handleChangeFontSize() {
        const changeSizeButtonContainers = document.querySelectorAll('.js__changeSizeButton');

        changeSizeButtonContainers.forEach((container) => {
            const sizeDefault = container.querySelector('.js__defaultSize');
            const sizePlus = container.querySelector('.js__plusSize');

            const sizeContent = document.querySelector(".js__changeSizeContent");
            if (!sizeContent || !sizePlus || !sizeDefault) return;

            const paragraphs = sizeContent.querySelectorAll("p");
            let increaseCount = 0;
            const maxIncrease = 3;

            const defaultFontSizes = Array.from(paragraphs).map((p) =>
                parseInt(window.getComputedStyle(p).fontSize, 10)
            );

            sizePlus.addEventListener('click', () => {
                if (increaseCount < maxIncrease) {
                    increaseCount++;
                    paragraphs.forEach((paragraph, index) => {
                        paragraph.style.fontSize = `${defaultFontSizes[index] + increaseCount}px`;
                    });
                }
            });

            sizeDefault.addEventListener('click', () => {
                if (increaseCount > 0) {
                    increaseCount--;
                    paragraphs.forEach((paragraph, index) => {
                        paragraph.style.fontSize = `${defaultFontSizes[index] + increaseCount}px`;
                    });
                }
            });
        });
    }

    function handleFullScreenEma() {
        const widthDoc = document.body;
        if (!widthDoc) return;

        const expNoEditFull = document.querySelectorAll('[view="lg"]');
        expNoEditFull.forEach((a) => {
            a.style.width = `${widthDoc.clientWidth}px`;
            a.style.marginLeft = `-${a.offsetLeft}px`;
        });
    }

    function handleAudio() {
        const ranges = document.querySelectorAll('input[type="range"]');
        const playsRadio = document.querySelectorAll(".js__playRadio");
        const volumsRadio = document.querySelectorAll(".js__radioVolum");

        ranges.forEach((input) => {
            input.style.backgroundSize = `${input.value}% ${input.max}%`;
            input.addEventListener('input', (e) => {
                const target = e.target;
                const min = target.min || 0;
                const max = target.max || 100;
                const val = target.value;
                target.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;
            });
        });

        playsRadio.forEach((play) => {
            play.addEventListener('click', function () {
                this.classList.toggle("active");
            });
        });

        volumsRadio.forEach((volum) => {
            volum.addEventListener('click', function () {
                this.classList.toggle("active");
            });
        });
    }

    function handleStickyHeader() {
        const stickyHeaderPC = document.querySelector(".js__stickyHeader");
        if (stickyHeaderPC) {
            stickyHeaderPC.classList.toggle("sticky", window.scrollY > 300);
            
        }
    }
    function handleStickyAds() {
        const stickyAds = document.querySelectorAll(".js__stickyAds");
        if (stickyAds === 0) return;

        stickyAds.forEach((item)=>{
            item.classList.toggle("sticky", window.scrollY > 400);
        })
        
    }

    function handleBackTop() {
        if (!backTop) return;
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function handleBackTopVisibility() {
        if (!backTop) return;
        const isVisible = document.body.scrollTop > 300 || document.documentElement.scrollTop > 300;
        backTop.style.opacity = isVisible ? "1" : "0";
        backTop.style.visibility = isVisible ? "visible" : "hidden";
    }

    function handleWindowScroll() {
        handleStickyHeader();
        handleStickyAds();
        handleBackTopVisibility();
    }

    // -------------------------------------------------------------
    // 4. INITIALIZATION
    // -------------------------------------------------------------
    function initAllSliders() {
        // Auto Slides
        initSwipers(".js__autoSlideContainer", ".js__swiperAuto", { slidesPerView: "auto", spaceBetween: 8 });

        // One Item
        initSwipers(".js__oneSlidesContainer", ".js__oneSlide", { slidesPerView: 1, spaceBetween: 10 });

        // Two Items
        initSwipers(".js__twoSlidesContainer", ".js__twoSlide", {
            slidesPerView: 2,
            spaceBetween: 15,
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2, spaceBetween: 15 } }
        });

        // Two Secondary
        initSwipers(".js__twoSecondarySlidesContainer", ".js__twoSlide", {
            slidesPerView: 1,
            spaceBetween: 15,
            breakpoints: { 768: { slidesPerView: 1 }, 1024: { slidesPerView: 2, spaceBetween: 15 } }
        });

        // Two Tertiary
        initSwipers(".js__twoTertiarySlidesContainer", ".js__twoSlide", {
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: { 768: { slidesPerView: 1 }, 1024: { slidesPerView: 2, spaceBetween: 60 } }
        });

        // Three Items
        initSwipers(".js__threeSlidesContainer", ".js__threeSlide", {
            slidesPerView: 2,
            spaceBetween: 15,
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3, spaceBetween: 15 } }
        });

        // Four Items
        initSwipers(".js__fourSlidesContainer", ".js__fourSlide", {
            slidesPerView: 2,
            spaceBetween: 15,
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4, spaceBetween: 15 } }
        });

        // Five Items
        initSwipers(".js__fiveSlidesContainer", ".js__fiveSlide", {
            slidesPerView: 1,
            spaceBetween: 10,
            breakpoints: { 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5, spaceBetween: 20 } }
        });
    }

    function initApp() {
        initExplusSliders();
        initAllSliders();

        handleMoreMenu();
        handleShowSubMenu();
        handleShowDropdownSubMenu();
        handleShowSearchMb();
        handleNavbarMb();
        handleShowPopupLogin();
        handleShowDropdown();
        handleCollapse();
        handleBackTop();
        handleChangeTab();
        handleChangeFontSize();
        handleFullScreenEma();
        handleAudio();
        handleVideo_16x9();

        window.addEventListener('scroll', handleWindowScroll);
        window.addEventListener('resize', handleWindowScroll);
    }

    initApp();
});