// Global Constants and Configurations
const WEDDING_DATE_STR = "2026-12-06T18:00:00";
const RSVP_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbwcfA7lFgo4EF4YDyZY5HvT-PW35lXudpfO5gVM6OtvRDVkOao0u_3VB71R_YWW8Rkf/exec";

const RSVP_SUBMIT_LABEL = "GỬI PHẢN HỒI";

document.addEventListener("DOMContentLoaded", () => {
    initEnvelopeGate();
    initCountdownTimer();
    initHeartRain();
    initHeroParallax();
    initMusicController();
    initScrollReveal();
    initGalleryReveal();
    initCoupleReveal();
    initMapPopup();
    initGiftToggle();
    initAlbumBook();
    initRSVPForm();
});

// 1. Envelope Opening Controller (Mở Thiệp)
function initEnvelopeGate() {
    const btnOpen = document.getElementById("btn-open-envelope");
    const envelopeGate = document.getElementById("envelope-gate");
    const mainApp = document.getElementById("wedding-invite-app");
    const musicPlay = document.getElementById("wedding-music");

    if (!btnOpen || !envelopeGate) return;

    btnOpen.addEventListener("click", () => {
        // Hai cánh cửa trượt ra, thẻ mờ dần
        envelopeGate.classList.add("opening");

        setTimeout(() => {
            envelopeGate.style.display = "none";
        }, 1800);

        // Hiện nội dung chính
        if (mainApp) mainApp.classList.remove("hidden");

        // Phát nhạc ngay khi người dùng bấm (vượt giới hạn autoplay của trình duyệt)
        if (musicPlay) {
            musicPlay.play().catch(err => {
                console.log("Audio autoplay was prevented, waiting for trigger.", err);
            });
        }
    });
}

// 2. Real-Time Wedding Countdown Timer Clock
function initCountdownTimer() {
    const weddingDateTime = new Date(WEDDING_DATE_STR).getTime();

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    const pad = (n) => (n < 10 ? "0" + n : String(n));

    function updateClock() {
        const difference = weddingDateTime - Date.now();

        if (difference < 0) {
            elDays.innerText = "00";
            elHours.innerText = "00";
            elMinutes.innerText = "00";
            elSeconds.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        elDays.innerText = pad(days);
        elHours.innerText = pad(hours);
        elMinutes.innerText = pad(minutes);
        elSeconds.innerText = pad(seconds);
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// 3. Spawns Falling Golden Hearts
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

    const randomSize = Math.random() * 20 + 10;     // 10px - 30px
    const randomLeft = Math.random() * 100;         // 0% - 100%
    const randomDuration = Math.random() * 6 + 8;   // 8s - 14s
    const randomDelay = Math.random() * 8;          // 0s - 8s

    heart.style.width = `${randomSize}px`;
    heart.style.height = `${randomSize}px`;
    heart.style.left = `${randomLeft}%`;
    heart.style.bottom = "-50px";
    heart.style.animationDuration = `${randomDuration}s`;
    heart.style.animationDelay = `${randomDelay}s`;

    container.appendChild(heart);
}

// Hero parallax (nằm trong DOMContentLoaded, có kiểm tra null)
function initHeroParallax() {
    const heroBg = document.querySelector(".hero-bg");
    if (!heroBg) return;

    let ticking = false;

    function update() {
        heroBg.style.transform =
            `scale(1.15) translateY(${window.scrollY * 0.18}px)`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
}

// 4. Music Playback Controller Toggle
function initMusicController() {
    const btnMusic = document.getElementById("music-toggle");
    const audioTrack = document.getElementById("wedding-music");

    if (!btnMusic || !audioTrack) return;

    const ring = btnMusic.querySelector(".pulse-ring");

    btnMusic.addEventListener("click", () => {
        if (audioTrack.paused) {
            audioTrack.play().catch(err => {
                console.log("Không phát được nhạc (kiểm tra file music.mp3).", err);
            });
            btnMusic.style.color = "var(--gold)";
            if (ring) ring.style.display = "block";
        } else {
            audioTrack.pause();
            btnMusic.style.color = "#ccc";
            if (ring) ring.style.display = "none";
        }
    });
}

// 5. Scroll reveal cho các section
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".section-countdown, .calendar-section, .family-section, .section-events, .section-rsvp, .section-gift, .main-footer"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => {
        el.classList.add("fade-up-scroll");
        observer.observe(el);
    });
}

function initGalleryReveal() {
    const galleryItems = document.querySelectorAll(".gallery-item-premium");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.15 });

    galleryItems.forEach((item) => observer.observe(item));
}

// Couple profile scroll reveal
function initCoupleReveal() {
    const profileCards = document.querySelectorAll(".groom-side, .bride-side");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.25 });

    profileCards.forEach((card) => observer.observe(card));
}

function initMapPopup() {
    const popup = document.getElementById("map-popup");
    const openBtn = document.getElementById("open-map");
    const closeBtn = document.getElementById("map-close-btn");
    const overlay = document.getElementById("close-map");

    if (!popup || !openBtn) return;

    function openPopup(e) {
        e.preventDefault();
        popup.classList.add("show");
    }

    function closePopup() {
        popup.classList.remove("show");
    }

    openBtn.addEventListener("pointerup", openPopup);
    if (closeBtn) closeBtn.addEventListener("pointerup", closePopup);
    if (overlay) overlay.addEventListener("pointerup", closePopup);
}

function initGiftToggle() {
    const btn = document.getElementById("gift-toggle-btn");
    const giftBox = document.getElementById("gift-hidden");

    if (!btn || !giftBox) return;

    // Lấy nhãn gốc từ HTML để không bị lệch hoa/thường
    const defaultLabel = btn.innerText.trim();

    btn.addEventListener("click", () => {
        giftBox.classList.toggle("show");
        btn.innerText = giftBox.classList.contains("show") ? "Ẩn" : defaultLabel;
    });
}

// 6. RSVP
function setSubmitIdle(form) {
    const submitBtn = form.querySelector(".btn-submit");
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.innerText = RSVP_SUBMIT_LABEL;
}

function resetGuestSelect() {
    const guestSelect = document.getElementById("rsvp-guests");
    if (!guestSelect) return;
    guestSelect.disabled = false;
    guestSelect.style.opacity = "1";
    guestSelect.value = "1";
}

function initRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const successBox = document.getElementById("rsvp-success");
    const formWrapper = document.getElementById("rsvp-form-wrapper");
    const guestSelect = document.getElementById("rsvp-guests");
    const attendingInputs = document.querySelectorAll('input[name="attending"]');

    if (!form || !guestSelect) return;

    /* Đổi trạng thái tham dự */
    attendingInputs.forEach(input => {
        input.addEventListener("change", () => {
            const checked = document.querySelector('input[name="attending"]:checked');
            if (!checked) return;

            if (checked.value === "no") {
                guestSelect.disabled = true;
                guestSelect.style.opacity = ".5";
            } else {
                guestSelect.disabled = false;
                guestSelect.style.opacity = "1";
                if (!guestSelect.value || guestSelect.value === "0") {
                    guestSelect.value = "1";
                }
            }
        });
    });

    /* Gửi form */
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector(".btn-submit");
        if (submitBtn.disabled) return; // chặn bấm đúp

        submitBtn.disabled = true;
        submitBtn.innerText = "ĐANG GỬI...";

        const attendingValue =
            document.querySelector('input[name="attending"]:checked').value;

        const data = {
            name: document.getElementById("guest-name").value,
            attending: attendingValue === "yes" ? "Có" : "Không",
            guests: attendingValue === "yes" ? guestSelect.value : "0",
            message: document.getElementById("rsvp-message").value
        };

        console.log("Saving RSVP Payload:", data);

        try {
            // Apps Script không trả header CORS, nên dùng no-cors:
            // request vẫn được gửi đi và ghi vào Sheet, chỉ là không đọc được response.
            await fetch(RSVP_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(data)
            });

            formWrapper.classList.add("hidden");
            successBox.classList.remove("hidden");

            form.reset();
            resetGuestSelect();
        } catch (error) {
            console.error(error);
            alert("Không thể gửi phản hồi 😭");
        } finally {
            // Luôn trả nút về trạng thái ban đầu (thành công hay lỗi)
            setSubmitIdle(form);
        }
    });
}

/* Nút "Chỉnh sửa phản hồi": quay lại form trắng */
function resetRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const successBox = document.getElementById("rsvp-success");
    const formWrapper = document.getElementById("rsvp-form-wrapper");

    if (!form || !successBox || !formWrapper) return;

    form.reset();
    resetGuestSelect();
    setSubmitIdle(form);

    successBox.classList.add("hidden");
    formWrapper.classList.remove("hidden");
}


/* =========================================================
   7. ALBUM CƯỚI - SÁCH LẬT 3D
   - Ảnh: images/album/01.jpg ... (số trang = data-count)
   - Desktop: mở 2 trang, bìa trước/sau nằm giữa
   - Điện thoại (<640px): 1 trang/lần
   - Kéo để lật, chạm nửa trái/phải, phím mũi tên, nút bấm
========================================================= */
function initAlbumBook() {
    const section = document.getElementById("album-section");
    const stage = document.getElementById("album-stage");
    const wrap = document.getElementById("album-wrap");
    const book = document.getElementById("album-book");
    const btnPrev = document.getElementById("album-prev");
    const btnNext = document.getElementById("album-next");
    const btnExpand = document.getElementById("album-expand");
    const btnClose = document.getElementById("album-close");
    const elCounter = document.getElementById("album-counter");

    if (!section || !stage || !wrap || !book) return;

    const N = parseInt(wrap.dataset.count, 10) || 0;
    if (N < 2) return;

    const PATH = wrap.dataset.path || "images/album/";
    const EXT = wrap.dataset.ext || "jpg";
    let ratio = parseFloat(wrap.dataset.ratio) || 1.423; // cao / rộng của 1 trang

    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const srcOf = (i) => `${PATH}${String(i + 1).padStart(2, "0")}.${EXT}`;
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    /* ---------- state ---------- */
    let started = false;
    let mode = "spread";     // "spread" (2 trang) | "single" (1 trang)
    let leaves = [];         // các tờ giấy
    let cnt = 0;             // số tờ
    let maxP = 0;            // vị trí tối đa của p
    let p = 0;               // vị trí hiện tại (có thể lẻ khi đang lật)
    let target = 0;
    let anim = null;
    let drag = null;
    let pw = 0, ph = 0;      // kích thước 1 trang (px)
    let edgeL, edgeR, floor;
    let placeholder = null;  // chỗ cũ của stage khi phóng to

    /* ---------- xây DOM ---------- */
    function makeFace(idx, side) {
        const face = document.createElement("div");
        face.className = "ab-face ab-" + side;

        if (idx < N) {
            const img = document.createElement("img");
            img.alt = "Album cưới - trang " + (idx + 1);
            img.draggable = false;
            img.dataset.src = srcOf(idx);
            face.appendChild(img);
        }

        const shade = document.createElement("div");
        shade.className = "ab-shade";
        face.appendChild(shade);
        return face;
    }

    function build() {
        book.innerHTML = "";
        leaves = [];

        floor = document.createElement("div");
        floor.className = "ab-floor";
        edgeL = document.createElement("div");
        edgeL.className = "ab-edge ab-edge-l";
        edgeR = document.createElement("div");
        edgeR.className = "ab-edge ab-edge-r";
        book.append(floor, edgeL, edgeR);

        cnt = mode === "spread" ? Math.ceil(N / 2) : N;
        maxP = mode === "spread" ? cnt : cnt - 1;

        for (let k = 0; k < cnt; k++) {
            const el = document.createElement("div");
            el.className = "ab-leaf";

            const front = makeFace(mode === "spread" ? 2 * k : k, "front");
            el.appendChild(front);
            let back = null;
            if (mode === "spread") {
                back = makeFace(2 * k + 1, "back");
                el.appendChild(back);
            }

            book.appendChild(el);
            leaves.push({
                el, front, back,
                frontShade: front.querySelector(".ab-shade"),
                backShade: back ? back.querySelector(".ab-shade") : null,
                vis: true, z: "", tf: "", sf: -1, sb: -1
            });
        }

        const firstImg = book.querySelector("img");
        if (firstImg) {
            firstImg.addEventListener("load", () => {
                if (!firstImg.naturalWidth) return;
                const r = firstImg.naturalHeight / firstImg.naturalWidth;
                if (Math.abs(r - ratio) > 0.005) {
                    ratio = r;
                    layout();
                }
            });
        }
    }

    /* ---------- kích thước ---------- */
    function layout() {
        const Wc = wrap.clientWidth;
        if (!Wc) return;

        const expanded = stage.classList.contains("is-expanded");
        const vh = window.innerHeight;
        const Hmax = expanded ? vh - 160 : clamp(vh - 210, 360, 880);
        const newMode = Wc < 640 ? "single" : "spread";

        if (!leaves.length || newMode !== mode) {
            // đổi chế độ: giữ nguyên trang đang xem
            const page = pageIndexOf(Math.round(p));
            mode = newMode;
            build();
            p = target = indexToP(page);
        }

        const colW = mode === "spread" ? Wc / 2 : Wc;
        pw = Math.floor(Math.min(colW, Hmax / ratio));
        ph = Math.floor(pw * ratio);

        const bookW = mode === "spread" ? pw * 2 : pw;
        wrap.style.height = ph + "px";
        book.style.width = bookW + "px";
        book.style.height = ph + "px";
        book.style.left = Math.round((Wc - bookW) / 2) + "px";

        leaves.forEach((lf) => {
            lf.el.style.width = pw + "px";
            lf.el.style.height = ph + "px";
            lf.el.style.left = (mode === "spread" ? pw : 0) + "px";
        });

        floor.style.display = mode === "spread" ? "" : "none";
        if (mode !== "spread") edgeL.style.display = edgeR.style.display = "none";

        render();
        updateUI();
    }

    // p <-> chỉ số trang (0 = bìa trước, N-1 = bìa sau)
    function pageIndexOf(pos) {
        if (mode === "single") return clamp(pos, 0, N - 1);
        if (pos <= 0) return 0;
        if (pos >= maxP) return N - 1;
        return 2 * pos - 1;
    }

    function indexToP(page) {
        if (mode === "single") return clamp(page, 0, N - 1);
        if (page <= 0) return 0;
        if (page >= N - 1) return maxP;
        return Math.ceil(page / 2);
    }

    /* ---------- vẽ ---------- */
    function ensureLoaded(lf) {
        [lf.front, lf.back].forEach((face) => {
            if (!face) return;
            const img = face.querySelector("img");
            if (img && !img.getAttribute("src")) {
                img.src = img.dataset.src;
                // giải mã sẵn để lúc lật lần đầu không bị khựng / trống mặt sau
                if (img.decode) img.decode().catch(() => {});
            }
        });
    }

    function setShade(node, v, lf, key) {
        if (!node) return;
        const val = Math.round(v * 100) / 100;
        if (lf[key] === val) return;
        lf[key] = val;
        node.style.opacity = val;
    }

    function render() {
        if (!leaves.length) return;
        const base = Math.floor(p);
        const lo = base - (mode === "spread" ? 2 : 1);
        const hi = base + 3;

        // bóng (tính trước cho các tờ trong tầm nhìn)
        const sf = new Array(cnt).fill(0);
        const sb = new Array(cnt).fill(0);

        if (p > base && base < cnt) {
            const t = p - base;
            const u = Math.sin(Math.PI * t);
            if (t < 0.5) sf[base] = 0.45 * u;
            else sb[base] = 0.45 * u;
            if (base + 1 < cnt) sf[base + 1] = Math.max(sf[base + 1], 0.55 * u * (1 - t));
            if (mode === "spread" && base - 1 >= 0) sb[base - 1] = Math.max(sb[base - 1], 0.55 * u * t);
        }

        for (let k = 0; k < cnt; k++) {
            const lf = leaves[k];
            const t = clamp(p - k, 0, 1);

            const inRange = k >= lo && k <= hi && !(mode === "single" && t >= 1);
            if (!inRange) {
                if (lf.vis) { lf.el.style.display = "none"; lf.vis = false; }
                continue;
            }
            if (!lf.vis) { lf.el.style.display = ""; lf.vis = true; }
            if (k >= base - 3 && k <= base + 4) ensureLoaded(lf);

            const tf = "rotateY(" + (-180 * t).toFixed(2) + "deg)";
            if (lf.tf !== tf) { lf.el.style.transform = tf; lf.tf = tf; }

            let z;
            if (t > 0 && t < 1) z = cnt + 5;       // đang lật: nằm trên cùng
            else if (t >= 1) z = k;                // đã lật sang trái
            else z = cnt - k;                      // còn bên phải
            if (lf.z !== z) { lf.el.style.zIndex = z; lf.z = z; }

            setShade(lf.frontShade, sf[k], lf, "sf");
            setShade(lf.backShade, sb[k], lf, "sb");
        }

        if (mode === "spread") {
            // dịch sách để bìa trước / bìa sau nằm giữa khung
            const shift = -(pw / 2) * (1 - Math.min(p, 1)) + (pw / 2) * Math.max(0, p - (maxP - 1));
            book.style.transform = "translateX(" + shift.toFixed(1) + "px)";

            // cạnh xếp giấy: chỉ có khi bên đó thật sự có trang
            const wL = p >= 1 ? clamp(p * 0.5, 0, 7) : 0;
            const wR = clamp((maxP - p) * 0.5, 0, 7);
            edgeL.style.display = wL > 0.3 ? "" : "none";
            edgeR.style.display = wR > 0.3 ? "" : "none";
            edgeL.style.width = wL.toFixed(1) + "px";
            edgeL.style.left = (-wL).toFixed(1) + "px";
            edgeR.style.width = wR.toFixed(1) + "px";
            edgeR.style.left = (pw * 2) + "px";

            const fl = pw * (1 - Math.min(p, 1));
            const fr = pw * 2 - pw * clamp(p - (maxP - 1), 0, 1);
            floor.style.left = fl.toFixed(1) + "px";
            floor.style.width = Math.max(0, fr - fl).toFixed(1) + "px";
        } else {
            book.style.transform = "";
        }
    }

    /* ---------- giao diện: nhãn trang + nút ---------- */
    function labelOf(pos) {
        if (mode === "spread") {
            if (pos <= 0) return "Bìa trước";
            if (pos >= maxP) return "Bìa sau";
            return "Trang " + (2 * pos) + " – " + (2 * pos + 1) + " / " + N;
        }
        return "Trang " + (pos + 1) + " / " + N;
    }

    function updateUI() {
        const pos = anim ? target : Math.round(p);
        if (elCounter) elCounter.textContent = labelOf(pos);
        if (btnPrev) btnPrev.disabled = pos <= 0;
        if (btnNext) btnNext.disabled = pos >= maxP;
    }

    /* ---------- chuyển động ---------- */
    function stopAnim() {
        if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
    }

    function animateTo(to, ease) {
        to = clamp(Math.round(to), 0, maxP);
        stopAnim();
        target = to;

        const from = p;
        const delta = to - from;
        if (Math.abs(delta) < 0.001) {
            p = to;
            render();
            updateUI();
            return;
        }

        let dur = Math.max(260, Math.min(1400, 760 * Math.pow(Math.abs(delta), 0.85)));
        if (reduceMotion) dur = 60;
        const fn = ease || easeInOut;
        const t0 = performance.now();

        anim = { raf: 0 };
        updateUI();

        const step = (now) => {
            const k = clamp((now - t0) / dur, 0, 1);
            p = from + delta * fn(k);
            render();
            if (k < 1) {
                anim.raf = requestAnimationFrame(step);
            } else {
                p = to;
                anim = null;
                render();
                updateUI();
            }
        };
        anim.raf = requestAnimationFrame(step);
    }

    function go(dir) {
        const base = anim ? target : Math.round(p);
        const to = clamp(base + dir, 0, maxP);
        if (to === base) return;
        animateTo(to);
    }

    const next = () => go(1);
    const prev = () => go(-1);

    /* ---------- kéo / chạm ---------- */
    function onTap(clientX) {
        const rect = wrap.getBoundingClientRect();
        const base = Math.round(p);

        if (mode === "spread") {
            if (base === 0) return next();
            if (base === maxP) return prev();
            return clientX < rect.left + rect.width / 2 ? prev() : next();
        }
        return clientX < rect.left + rect.width * 0.35 ? prev() : next();
    }

    wrap.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        if (anim) return;
        drag = {
            id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(),
            base: Math.round(p), dir: 0, dead: false, lastX: e.clientX, lastT: performance.now(), v: 0
        };
    });

    wrap.addEventListener("pointermove", (e) => {
        if (!drag || e.pointerId !== drag.id || drag.dead) return;

        const dx = e.clientX - drag.x0;
        const dy = e.clientY - drag.y0;

        if (!drag.dir) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.1) return;
            const dir = dx < 0 ? 1 : -1;
            const nb = drag.base + dir;
            if (nb < 0 || nb > maxP) { drag.dead = true; return; }
            drag.dir = dir;
            try { wrap.setPointerCapture(e.pointerId); } catch (err) { /* bỏ qua */ }
            wrap.classList.add("dragging");
        }

        const prog = clamp((dx * -drag.dir) / (pw * 0.95), 0, 1);
        p = drag.base + drag.dir * prog;

        const now = performance.now();
        const dt = now - drag.lastT;
        if (dt > 0) drag.v = ((e.clientX - drag.lastX) / dt) * -drag.dir; // px/ms theo chiều lật
        drag.lastX = e.clientX;
        drag.lastT = now;

        render();
    });

    function endDrag(e, cancelled) {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag;
        drag = null;
        wrap.classList.remove("dragging");

        if (d.dir) {
            const prog = Math.abs(p - d.base);
            const complete = !cancelled && (prog > 0.33 || d.v > 0.45);
            animateTo(complete ? d.base + d.dir : d.base, easeOut);
        } else if (!cancelled && !d.dead) {
            const moved = Math.hypot(e.clientX - d.x0, e.clientY - d.y0);
            if (moved < 10 && performance.now() - d.t0 < 600) onTap(e.clientX);
        }
    }

    wrap.addEventListener("pointerup", (e) => endDrag(e, false));
    wrap.addEventListener("pointercancel", (e) => endDrag(e, true));
    wrap.addEventListener("dragstart", (e) => e.preventDefault());

    if (btnPrev) btnPrev.addEventListener("click", prev);
    if (btnNext) btnNext.addEventListener("click", next);

    /* ---------- phím tắt ---------- */
    document.addEventListener("keydown", (e) => {
        const expanded = stage.classList.contains("is-expanded");
        const active = expanded || stage.matches(":hover") || stage.contains(document.activeElement);
        if (!active || !started) return;

        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
        else if (e.key === "Escape" && expanded) { collapse(); }
    });

    /* ---------- phóng to / thu nhỏ ---------- */
    function expand() {
        if (stage.classList.contains("is-expanded")) return;
        placeholder = document.createComment("album-stage");
        stage.parentNode.insertBefore(placeholder, stage);
        document.body.appendChild(stage);
        stage.classList.add("is-expanded");
        document.body.classList.add("album-lock");
        stage.focus({ preventScroll: true });
        layout();
        requestAnimationFrame(layout);
    }

    function collapse() {
        if (!stage.classList.contains("is-expanded")) return;
        stage.classList.remove("is-expanded");
        document.body.classList.remove("album-lock");
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.insertBefore(stage, placeholder);
            placeholder.remove();
        }
        placeholder = null;
        layout();
        requestAnimationFrame(layout);
    }

    if (btnExpand) btnExpand.addEventListener("click", expand);
    if (btnClose) btnClose.addEventListener("click", collapse);

    /* ---------- khởi động khi gần tới section ---------- */
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
        if (!started) return;
        cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(layout);
    });

    function start() {
        if (started) return;
        if (!wrap.clientWidth) return; // trang chưa hiển thị (đang ở màn hình mở thiệp)
        started = true;
        layout();
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                start();
                if (started) io.disconnect();
            }
        });
    }, { rootMargin: "600px 0px" });

    io.observe(section);
}
