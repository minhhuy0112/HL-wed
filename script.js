// Global Constants and Configurations
const WEDDING_DATE_STR = "2026-12-06T18:00:00";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Interactive Components
    initEnvelopeGate();
    initCountdownTimer();
    initHeartRain();
    initMusicController();
    initScrollReveal();
    initGalleryReveal();
    initMapPopup();
    initGiftToggle();
	initRSVPForm();
});

// 1. Envelope Opening Controller (Mở Thiệp)
function initEnvelopeGate() {
    const btnOpen = document.getElementById("btn-open-envelope");
    const envelopeGate = document.getElementById("envelope-gate");
    const mainApp = document.getElementById("wedding-invite-app");
    const musicPlay = document.getElementById("wedding-music");

    if (btnOpen && envelopeGate) {
        btnOpen.addEventListener("click", () => {
            // Smoothly open and fade out the entry gate
           //envelopeGate.classList.add("fade-out");
envelopeGate.classList.add("opening");

setTimeout(() => {

    envelopeGate.style.display = "none";

}, 1800);
	
            
            // Show main container
            mainApp.classList.remove("hidden");
            
            // Triggers automatic music play on user tap interaction (browser restriction bypass)
            if (musicPlay) {
                musicPlay.play().catch(err => {
                    console.log("Audio autoplay was prevented, waiting for trigger.", err);
                });
            }
        });
    }
}

// 2. Real-Time Wedding Countdown Timer Clock
function initCountdownTimer() {
    const weddingDateTime = new Date(WEDDING_DATE_STR).getTime();

    // Elements
    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");

    if (!elDays) return;

    function updateClock() {
        const now = new Date().getTime();
        const difference = weddingDateTime - now;

        if (difference < 0) {
            // Date passed
            elDays.innerText = "00";
            elHours.innerText = "00";
            elMinutes.innerText = "00";
            elSeconds.innerText = "00";
            return;
        }

        // Calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format to double digits
        elDays.innerText = days < 10 ? "0" + days : days;
        elHours.innerText = hours < 10 ? "0" + hours : hours;
        elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;
        elSeconds.innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    // Run clock once and setInterval
    updateClock();
    setInterval(updateClock, 1000);
}

// 3. Spawns Falling Golden Hearts & Flowers Pattern
function initHeartRain() {
    const container = document.getElementById("heart-container");
    if (!container) return;

    const particleCount = 15;
    const heartSvg = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

    for (let i = 0; i < particleCount; i++) {
        createHeart(container, heartSvg);
    }
}

function createHeart(container, svgMarkup) {
    const heart = document.createElement("div");
    heart.className = "floating-heart-element";
    heart.innerHTML = svgMarkup;

    // Randomize configurations
    const randomSize = Math.random() * 20 + 10; // 10px to 30px
    const randomLeft = Math.random() * 100; // 0% to 100%
    const randomDuration = Math.random() * 6 + 8; // 8s to 14s
    const randomDelay = Math.random() * 8; // 0s to 8s

    heart.style.width = `${randomSize}px`;
    heart.style.height = `${randomSize}px`;
    heart.style.left = `${randomLeft}%`;
    heart.style.bottom = "-50px";
    heart.style.animationDuration = `${randomDuration}s`;
    heart.style.animationDelay = `${randomDelay}s`;

    container.appendChild(heart);
}

// 4. Music Playback Controller Toggle
function initMusicController() {
    const btnMusic = document.getElementById("music-toggle");
    const audioTrack = document.getElementById("wedding-music");

    if (!btnMusic || !audioTrack) return;

    btnMusic.addEventListener("click", () => {
        if (audioTrack.paused) {
            audioTrack.play();
            btnMusic.style.color = "var(--gold)";
            btnMusic.querySelector(".pulse-ring").style.display = "block";
        } else {
            audioTrack.pause();
            btnMusic.style.color = "#ccc";
            btnMusic.querySelector(".pulse-ring").style.display = "none";
        }
    });
}

// 5. RSVP Submission Handling
function handleRSVPSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("rsvp-name").value;
    const attending = document.querySelector('input[name="attending"]:checked').value;
    const guests = document.getElementById("rsvp-guests").value;
    const message = document.getElementById("rsvp-message").value;

    const payload = {
        name: name,
        attending: attending,
        guests: guests,
        message: message,
        submittedAt: new Date().toISOString()
    };

    console.log("Saving RSVP Payload to database:", payload);

    // Save locally or mock sending to Google Sheets / Firebase
    localStorage.setItem("rsvp_response", JSON.stringify(payload));

    // Show Success State visual transitions
    const formWrapper = document.getElementById("rsvp-form-wrapper");
    const successCard = document.getElementById("rsvp-success");

    if (formWrapper && successCard) {
        formWrapper.classList.add("hidden");
        successCard.classList.remove("hidden");
    }
}

// 6. Reset Form Visual states
function resetRSVPForm() {
    const formWrapper = document.getElementById("rsvp-form-wrapper");
    const successCard = document.getElementById("rsvp-success");
    const formEl = document.getElementById("rsvp-form");

    if (formWrapper && successCard && formEl) {
        formEl.reset();
        formWrapper.classList.remove("hidden");
        successCard.classList.add("hidden");
    }
}




function initScrollReveal() {

    const revealElements = document.querySelectorAll(
        ".section-countdown, .calendar-section, .section-couple, .section-events, .section-rsvp, .section-gift, .main-footer"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach((el) => {

        el.classList.add("fade-up-scroll");

        observer.observe(el);

    });

}

function initGalleryReveal() {

    const galleryItems = document.querySelectorAll(
        ".gallery-item-premium"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    }, {
        threshold: 0.15
    });

    galleryItems.forEach((item) => {

        observer.observe(item);

    });

}

function initMapPopup() {

    const popup = document.getElementById("map-popup");

    const openBtn = document.getElementById("open-map");

    const closeBtn = document.getElementById("map-close-btn");

    const overlay = document.getElementById("close-map");

    function openPopup(e) {

        e.preventDefault();

        popup.classList.add("show");

    }

    function closePopup() {

        popup.classList.remove("show");

    }

    openBtn.addEventListener("pointerup", openPopup);

    closeBtn.addEventListener("pointerup", closePopup);

    overlay.addEventListener("pointerup", closePopup);

}

function initGiftToggle() {

    const btn = document.getElementById("gift-toggle-btn");

    const giftBox = document.getElementById("gift-hidden");

    btn.addEventListener("click", () => {

        giftBox.classList.toggle("show");

        if(giftBox.classList.contains("show")){

            btn.innerText = "Ẩn";

        } else {

            btn.innerText = "Gửi mừng cưới";

        }

    });

}

function initRSVPForm() {

    const form = document.getElementById("rsvp-form");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn = form.querySelector("button");

        submitBtn.disabled = true;

        submitBtn.innerText = "Đang gửi...";

        const data = {

            name: document
                .getElementById("guest-name")
                .value,

            phone: document
                .getElementById("guest-phone")
                .value,

            guests: document
                .getElementById("guest-count")
                .value,

            message: document
                .getElementById("guest-message")
                .value
        };

        try {

            await fetch(
                "https://script.google.com/macros/s/AKfycbwYpVw7z52DI_tPLwRvzzzBDBdgXebClSo3RXHpftazGUYOBwL6jOP4NiBVUkMli6-u/exec",
                {

                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );

            submitBtn.innerText =
                "Đã xác nhận ✓";

            form.reset();

        } catch (error) {

            submitBtn.disabled = false;

            submitBtn.innerText =
                "Gửi lại";

            alert(
                "Có lỗi xảy ra 😭"
            );
        }

    });

}
