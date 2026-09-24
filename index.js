/* ============================================
   ELEMENTS
============================================ */

const screens = {
    first: document.getElementById("screen1"),
    second: document.getElementById("screen2"),
    third: document.getElementById("screen3")
};

const choices = document.querySelectorAll(".choice");

const continueButton =
    document.getElementById("continueButton");

const musicButton =
    document.getElementById("musicButton");

const music =
    document.getElementById("music");

const musicText =
    document.getElementById("musicText");

const typedText =
    document.getElementById("typedText");

const finalMessage =
    document.getElementById("finalMessage");

const floatingHearts =
    document.getElementById("floatingHearts");


/* ============================================
   STATE
============================================ */

let selectedChoice = null;

let currentScreen = "first";

let musicStarted = false;

let typingStarted = false;


/* ============================================
   TEXT
============================================ */

const cityText = `
Мне нравится, как рядом с тобой самые обычные вещи
становятся какими-то особенными.

Можно просто идти по улице,
смеяться над какой-нибудь глупостью,
зайти куда-нибудь без плана,
а потом понять, что прошло уже несколько часов.

Наверное, мне именно это и нравится больше всего —
не место.

А то, что ты рядом.
`;

const cinemaText = `
Мне нравится мысль о том,
что иногда нам вообще не нужно ничего придумывать.

Просто выключить телефоны,
сесть рядом в темноте,
иногда случайно коснуться рукой
и потом обсуждать фильм по дороге домой.

Хотя, если честно,
я подозреваю, что половину фильма
я всё равно буду смотреть не на экран.
`;

const cityFinal = `
если честно,<br>
я бы выбрал любой маршрут,<br>
лишь бы в конце идти рядом с тобой.
`;

const cinemaFinal = `
если честно,<br>
я бы даже не спрашивал, какой фильм,<br>
лишь бы рядом была ты.
`;


/* ============================================
   SCREEN SWITCH
============================================ */

function switchScreen(from, to) {

    from.classList.add("leaving");

    setTimeout(() => {

        from.classList.remove("active");
        from.classList.remove("leaving");

        to.classList.add("active");

        currentScreen =
            Object.keys(screens).find(
                key => screens[key] === to
            );

    }, 550);
}


/* ============================================
   START MUSIC
============================================ */

function startMusic() {

    if (musicStarted) return;

    musicStarted = true;

    music.volume = 0;

    const playPromise = music.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                fadeMusicIn();

                musicText.textContent = "играет";

            })
            .catch(() => {

                musicStarted = false;

                musicText.textContent =
                    "включить музыку";
            });
    }
}


function fadeMusicIn() {

    let volume = 0;

    const fade = setInterval(() => {

        volume += 0.025;

        music.volume =
            Math.min(volume, 0.42);

        if (volume >= 0.42) {

            clearInterval(fade);
        }

    }, 70);
}


/* ============================================
   MUSIC BUTTON
============================================ */

musicButton.addEventListener("click", () => {

    if (music.paused) {

        music.play();

        music.volume = 0.42;

        musicText.textContent =
            "играет";

    } else {

        music.pause();

        musicText.textContent =
            "музыка";
    }

});


/* ============================================
   CHOICE
============================================ */

choices.forEach(choice => {

    choice.addEventListener("click", () => {

        selectedChoice =
            choice.dataset.choice;


        /* запускаем музыку */

        startMusic();


        /* визуально нажимаем карточку */

        choice.style.transform =
            "scale(0.97)";


        setTimeout(() => {

            choice.style.transform = "";

        }, 180);


        /* меняем письмо */

        if (selectedChoice === "city") {

            typedText.dataset.text =
                cityText;

        } else {

            typedText.dataset.text =
                cinemaText;

        }


        /* меняем финальный текст */

        if (selectedChoice === "city") {

            finalMessage.innerHTML =
                cityFinal;

        } else {

            finalMessage.innerHTML =
                cinemaFinal;

        }


        /* переходим на экран письма */

        setTimeout(() => {

            switchScreen(
                screens.first,
                screens.second
            );

            startTyping();

        }, 350);

    });

});


/* ============================================
   TYPEWRITER
============================================ */

function startTyping() {

    if (typingStarted) {

        typedText.innerHTML =
            formatText(
                typedText.dataset.text
            );

        return;
    }

    typingStarted = true;

    const text =
        typedText.dataset.text.trim();

    typedText.textContent = "";

    let index = 0;


    function type() {

        if (index >= text.length) {

            return;
        }


        typedText.textContent +=
            text[index];


        index++;


        let delay = 25;


        if (
            text[index - 1] === "." ||
            text[index - 1] === "," ||
            text[index - 1] === "—"
        ) {

            delay = 180;
        }


        setTimeout(type, delay);
    }


    type();
}


function formatText(text) {

    return text
        .trim()
        .replace(/\n/g, "<br>");
}


/* ============================================
   CONTINUE
============================================ */

continueButton.addEventListener("click", () => {

    switchScreen(
        screens.second,
        screens.third
    );

});


/* ============================================
   FLOATING HEARTS
============================================ */

const heartSymbols = [
    "♡",
    "♡",
    "♥",
    "˚♡",
    "♡"
];


function createHeart() {

    const heart =
        document.createElement("span");


    heart.className = "heart";


    heart.textContent =
        heartSymbols[
            Math.floor(
                Math.random() *
                heartSymbols.length
            )
        ];


    const size =
        11 + Math.random() * 17;


    const left =
        Math.random() * 100;


    const duration =
        7 + Math.random() * 9;


    const drift =
        -80 + Math.random() * 160;


    heart.style.left =
        `${left}%`;


    heart.style.fontSize =
        `${size}px`;


    heart.style.animationDuration =
        `${duration}s`;


    heart.style.setProperty(
        "--drift",
        `${drift}px`
    );


    floatingHearts.appendChild(heart);


    setTimeout(() => {

        heart.remove();

    }, duration * 1000);
}


/* создаём сердечки постоянно */

setInterval(
    createHeart,
    850
);


/* несколько сразу при загрузке */

for (let i = 0; i < 7; i++) {

    setTimeout(
        createHeart,
        i * 400
    );
}


/* ============================================
   PARALLAX PHOTO EFFECT
============================================ */

const photoHeart =
    document.querySelector(".photo-heart");


if (photoHeart) {

    document.addEventListener(
        "mousemove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    0.5) * 2;


            const y =
                (event.clientY /
                    window.innerHeight -
                    0.5) * 2;


            photoHeart.style.transform =
                `
                rotate(-1deg)
                translate(
                    ${x * 4}px,
                    ${y * 4}px
                )
                `;
        }
    );
}


/* ============================================
   TOUCH PARALLAX
============================================ */

document.addEventListener(
    "touchmove",
    event => {

        if (!photoHeart) return;

        const touch =
            event.touches[0];

        const x =
            (touch.clientX /
                window.innerWidth -
                0.5) * 2;


        const y =
            (touch.clientY /
                window.innerHeight -
                0.5) * 2;


        photoHeart.style.transform =
            `
            rotate(-1deg)
            translate(
                ${x * 3}px,
                ${y * 3}px
            )
            `;
    },
    { passive: true }
);