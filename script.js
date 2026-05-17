const loader = document.querySelector(".loader");

const openInvite = document.getElementById("openInvite");

const music = document.getElementById("music");

const musicBtn = document.getElementById("musicBtn");

let playing = false;

/* OPEN INVITATION */

openInvite.addEventListener("click",()=>{

  music.play();

  playing = true;

  gsap.to(loader,{
    opacity:0,
    duration:1.5
  });

  setTimeout(()=>{
    loader.style.display="none";
  },1500);

  gsap.from(".hero-content .sub",{
    y:50,
    opacity:0,
    duration:1.2
  });

  gsap.from(".hero-content h1",{
    y:100,
    opacity:0,
    duration:1.8
  });

  gsap.from(".date",{
    y:40,
    opacity:0,
    duration:1.2
  });

});

/* SCROLL REVEAL */

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((el)=>{

  gsap.to(el,{

    scrollTrigger:{
      trigger:el,
      start:"top 80%"
    },

    y:0,
    opacity:1,
    duration:1.4

  });

});

/* COUNTDOWN */

const targetDate = new Date(
  "December 06, 2026 18:00:00"
).getTime();

setInterval(()=>{

  const now = new Date().getTime();

  const distance = targetDate - now;

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  document.getElementById("days").innerHTML = days;

  document.getElementById("hours").innerHTML = hours;

  document.getElementById("minutes").innerHTML = minutes;

  document.getElementById("seconds").innerHTML = seconds;

},1000);

/* MUSIC BUTTON */

musicBtn.addEventListener("click",()=>{

  if(!playing){

    music.play();

    playing = true;

  }else{

    music.pause();

    playing = false;

  }

});

/* GALLERY REVEAL */

const galleryItems = document.querySelectorAll(
  ".gallery-item, .gallery-quote"
);

const galleryObserver = new IntersectionObserver((entries)=>{

  entries.forEach((entry)=>{

    if(entry.isIntersecting){

      entry.target.classList.add("show");

    }

  });

},{
  threshold:0.2
});

galleryItems.forEach((item)=>{

  galleryObserver.observe(item);

});
