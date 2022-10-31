(function onLoad() {

    const themeSwitcher = document.getElementById('theme-switcher');
    const theme = document.getElementById('theme');
    const currentTheme = 'light';
    //localStorage.getItem('theme');
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");
    const navText = document.querySelector("#navbar-bottom-text");
    const next = document.querySelector("#next");
    const prev = document.querySelector("#prev");
    const navLink = document.querySelectorAll(".nav-link");

    let navState = 1;
    document.getElementById(`section-1-container`).classList.add("section-activated");



    ////////////////////////////////////////////////////////// theme switch
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitcher.checked = true;
        }
    }

    function switchTheme() {
        turnOnNavList();
        if (!themeSwitcher.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeSwitcher.checked = true;
            //localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeSwitcher.checked = false;
            //localStorage.setItem('theme', 'light');
        }
    }

    function turnOnNavList() {
        navList.style.transition = "0s";
        setInterval(() => {
            navList.style.transition = ".75s";
        }, 800);
    }

    theme.addEventListener('click', switchTheme, false);


    ////////////////////////////////////////////////////////// open menu 
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("is-active");
        navList.classList.toggle("nav-active");
        if (navList.classList.contains("nav-active")) {
            ResetSections(0);
        } else {
            ResetSections(navState);
        }
    });


    ////////////////////////////////////////////////////////// hide menu on resize
    const observerWidth = new ResizeObserver((entries) => {
        const [entry] = entries;
        if (entry.contentRect.width >= 700) {
            hideMenu();
        }
    });

    function hideMenu() {
        navList.classList.remove("nav-active");
        hamburger.classList.remove("is-active");
    }


    observerWidth.observe(document.querySelector("body"));

    ////////////////////////////////////////////////////////// activate links on click
    navList.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains("nav-link")) {
            ResetNavLinks();
            navState = e.target.getAttribute("href").slice(-1);
            e.target.classList.add("active-nav-link");
            if (window.innerWidth < 700) {
                hamburger.classList.remove("is-active");
                navList.classList.remove("nav-active");
            }
            const id = e.target.getAttribute('href').slice(-1);
            //document.querySelector(id).scrollIntoView();
            showSection(id);
        }
    });

    navList.addEventListener('mouseover', (e) => {
        ResetNavLinks();
    });




    navList.addEventListener('mouseleave', (e) => {
        navLink.forEach(el => {
            if (el.getAttribute("href").includes(navState)) el.classList.add("active-nav-link");
        });
    });

    function ResetNavLinks() {
        navLink.forEach(el => el.classList.remove("active-nav-link"));
    }

    function ResetSections(id) {
        document.querySelectorAll(".section-containers").forEach(el => {
            el.classList.remove("section-activated");
            el.style.visibility = "hidden";
        });
        if (id !== 0) {
            document.getElementById(`section-${id}-container`).classList.add("section-activated");
            document.getElementById(`section-${id}-container`).style.visibility = "visible";
        }
    }

    ////////////////////////////////////////////////////////// activate links on scroll
    // const obsMenuCallback = (entries) => {
    //     const [entry] = entries;
    //     if (entry.isIntersecting) {
    //         ResetNavLinks();
    //         ResetSections(entry.target.id.slice(-1));
    //         navText.innerText = `${entry.target.id.slice(-1)}/4`;
    //         navLink.forEach(el => {
    //             if (el.getAttribute("href").includes(entry.target.id)) {
    //                 el.classList.add("active-nav-link");
    //                 navState = el.getAttribute("href").slice(-1);
    //             }
    //         });
    //     }
    // };

    // const obsMenuOptions = {
    //     root: null,
    //     threshold: 0.3
    // };

    // const observerMenus = new IntersectionObserver(obsMenuCallback, obsMenuOptions);
    // const href = document.querySelectorAll("section");
    // href.forEach(el => observerMenus.observe(el));

    ////////////////////////////////////////////////////////// show section

    function showSection(id) {
        ResetNavLinks();
        ResetSections(id);
        navText.innerText = `${id}/4`;
        navLink.forEach(el => {
            if (el.getAttribute("href").includes(id)) {
                el.classList.add("active-nav-link");
                navState = id;
            }
        });
    }

    ////////////////////////////////////////////////////////// navigate next/prev buttons
    next.addEventListener('click', (e) => {
        nextSection();
    });

    function nextSection() {
        let nextNumber = parseInt(navState) + 1;
        if (nextNumber > 4) nextNumber = 1;
        //const id = nextNumber;
        //document.getElementById(id).scrollIntoView();
        showSection(nextNumber);
        hideMenu();
    }

    prev.addEventListener('click', (e) => {
        prevSection();
    });

    function prevSection() {
        let prevNumber = parseInt(navState) - 1;
        if (prevNumber < 1) prevNumber = 4;
        //const id = prevNumber;
        //document.getElementById(id).scrollIntoView();
        showSection(prevNumber);
        hideMenu();
    }

    ////////////////////////////////////////////////////////// projects slider
    const sliderLeft = document.querySelector("#slider-button-left");
    const sliderRight = document.querySelector("#slider-button-right");

    sliderLeft.addEventListener('click', (e) => {
        slideChange("left");
    });

    sliderRight.addEventListener('click', (e) => {
        slideChange("right");
    });

    const slideOrder = ["slide-hidden", "slide-left", "slide-center", "slide-right", "slide-hidden", "slide-hidden"];

    function slideChange(mode) {
        if (mode === "right") {
            const lastSlide = slideOrder.pop();
            slideOrder.unshift(lastSlide);
        } else if (mode === "left") {
            const firstSlide = slideOrder.shift();
            slideOrder.push(firstSlide);
        }
        slideShow();
    }

    function slideShow() {
        const slides = document.querySelectorAll(".project");
        slides.forEach((el, i) => {
            if(el.classList.contains("slide-hidden")) el.classList.remove("slide-hidden");
            if(el.classList.contains("slide-left")) el.classList.remove("slide-left");
            if(el.classList.contains("slide-right")) el.classList.remove("slide-right");
            if(el.classList.contains("slide-center")) el.classList.remove("slide-center");
            el.classList.add(slideOrder[i]);
        });
    }

    ////////////////////////////////////////////////////////// mousewheel scroll
    let mouseWheel = 0;
    document.querySelector('body').addEventListener('wheel', (e) => {
        mouseWheel = mouseWheel + e.deltaY;
        console.log(mouseWheel);
        if (mouseWheel > 700){
            nextSection();  
            mouseWheel = 0; 
        } else if (mouseWheel < -700) {
            prevSection();
            mouseWheel = 0;
        }
    });

    ////////////////////////////////////////////////////////// keyboard scroll
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            nextSection();
        } else if (e.key === 'ArrowDown') {
            prevSection();
        } else if (e.key === 'ArrowLeft') {
            slideChange("left");
        } else if (e.key === 'ArrowRight') {
            slideChange("right");
        }
    });

    ////////////////////////////////////////////////////////// touch scroll

    let touchStartY = 0;
    let touchEndY = 0;
    let touchDiffY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let touchDiffX = 0;

    document.querySelector('body').addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });

    document.querySelector('body').addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        touchDiffY = touchStartY - touchEndY;
        touchEndX = e.changedTouches[0].clientX;
        touchDiffX = touchStartX - touchEndX;
        if (touchDiffY > 100) {
            nextSection();
        } else if (touchDiffY < -100) {
            prevSection();
        }
        if (touchDiffX > 100) {
            slideChange("left");
        } else if (touchDiffX < -100) {
            slideChange("right");
        }
    });


    



})();