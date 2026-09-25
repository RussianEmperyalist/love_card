/* =====================================================
   ELEMENTS
===================================================== */

const screens = {
    first: document.getElementById("screen1"),
    second: document.getElementById("screen2"),
    third: document.getElementById("screen3")
};


const choices =
    document.querySelectorAll(".choice");


const continueButton =
    document.getElementById("continueButton");


const musicButton =
    document.getElementById("musicButton");


const music =
    document.getElementById("music");


const musicText =
    document.getElementById("musicText");


const typedText =
    document.getElementById("letterText");


const finalMessage =
    document.getElementById("finalChoiceText");


const floatingHearts =
    document.querySelector(".floating-hearts");


/* =====================================================
   STATE
===================================================== */

let selectedChoice = null;

let musicStarted = false;

let typingStarted = false;


/* =====================================================
   LETTER TEXT
===================================================== */

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


/* =====================================================
   SCREEN TRANSITION
===================================================== */

function switchScreen(from, to) {

    if (!from || !to) return;


    from.classList.add("leaving");


    setTimeout(() => {

        from.classList.remove("active");
        from.classList.remove("leaving");

        to.classList.add("active");

    }, 550);
}


/* =====================================================
   MUSIC
===================================================== */

function startMusic() {

    if (musicStarted) return;


    /*
        Важно:

        play() вызывается непосредственно
        после пользовательского клика.

        Это нужно для iPhone / Safari.
    */

    music.volume = 0.4;


    const promise =
        music.play();


    if (promise !== undefined) {

        promise
            .then(() => {

                musicStarted = true;

                musicText.textContent =
                    "играет ♫";

            })
            .catch((error) => {

                console.error(
                    "Музыка не запустилась:",
                    error
                );

                musicStarted = false;

                musicText.textContent =
                    "нажми ♫";

            });
    }
}


/* =====================================================
   MUSIC BUTTON
===================================================== */

musicButton.addEventListener(
    "click",
    () => {

        if (music.paused) {

            music.volume = 0.4;

            music.play()
                .then(() => {

                    musicStarted = true;

                    musicText.textContent =
                        "играет ♫";

                })
                .catch(error => {

                    console.error(
                        "Ошибка музыки:",
                        error
                    );

                });

        } else {

            music.pause();

            musicText.textContent =
                "музыка";
        }

    }
);


/* =====================================================
   MUSIC ERROR
===================================================== */

music.addEventListener(
    "error",
    () => {

        console.error(
            "Аудиофайл не найден или не может быть загружен."
        );

        musicText.textContent =
            "нет музыки";
    }
);


music.addEventListener(
    "canplay",
    () => {

        console.log(
            "Музыка готова к воспроизведению."
        );

    }
);


/* =====================================================
   CHOICE
===================================================== */

choices.forEach(choice => {

    choice.addEventListener(
        "click",
        () => {

            selectedChoice =
                choice.dataset.choice;


            /*
                Музыка запускается
                непосредственно внутри клика.
            */

            startMusic();


            /*
                Выбираем текст письма.
            */

            if (
                selectedChoice === "city"
            ) {

                typedText.dataset.text =
                    cityText;

                finalMessage.innerHTML =
                    cityFinal;

            } else {

                typedText.dataset.text =
                    cinemaText;

                finalMessage.innerHTML =
                    cinemaFinal;
            }


            /*
                Небольшая реакция карточки.
            */

            choice.style.transform =
                "scale(0.97)";


            setTimeout(() => {

                choice.style.transform = "";

            }, 160);


            /*
                Переходим дальше.
            */

            setTimeout(() => {

                switchScreen(
                    screens.first,
                    screens.second
                );


                /*
                    Начинаем печатать письмо
                    после появления второго экрана.
                */

                setTimeout(
                    startTyping,
                    350
                );

            }, 300);

        }
    );

});


/* =====================================================
   TYPEWRITER
===================================================== */

function startTyping() {

    const text =
        typedText.dataset.text;


    if (!text) return;


    if (typingStarted) {

        typedText.innerHTML =
            formatText(text);

        return;
    }


    typingStarted = true;

    typedText.textContent = "";


    const cleanText =
        text.trim();


    let index = 0;


    function typeNext() {

        if (
            index >=
            cleanText.length
        ) {

            return;
        }


        typedText.textContent +=
            cleanText[index];


        const character =
            cleanText[index];


        index++;


        let delay = 23;


        if (
            character === "." ||
            character === "," ||
            character === "—"
        ) {

            delay = 170;
        }


        setTimeout(
            typeNext,
            delay
        );
    }


    typeNext();
}


/* =====================================================
   FORMAT TEXT
===================================================== */

function formatText(text) {

    return text
        .trim()
        .replace(/\n/g, "<br>");
}


/* =====================================================
   CONTINUE
===================================================== */

continueButton.addEventListener(
    "click",
    () => {

        switchScreen(
            screens.second,
            screens.third
        );

    }
);


/* =====================================================
   FLOATING HEARTS
===================================================== */

const heartSymbols = [
    "♡",
    "♡",
    "♥",
    "˚♡"
];


function createHeart() {

    if (!floatingHearts) return;


    const heart =
        document.createElement("span");


    heart.className =
        "heart";


    heart.textContent =
        heartSymbols[
            Math.floor(
                Math.random() *
                heartSymbols.length
            )
        ];


    const size =
        10 +
        Math.random() * 16;


    const left =
        Math.random() * 100;


    const duration =
        7 +
        Math.random() * 8;


    const drift =
        -80 +
        Math.random() * 160;


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


    floatingHearts.appendChild(
        heart
    );


    setTimeout(
        () => {

            heart.remove();

        },
        duration * 1000
    );
}


/*
    Первые сердечки.
*/

for (
    let i = 0;
    i < 6;
    i++
) {

    setTimeout(
        createHeart,
        i * 350
    );
}


/*
    Новые сердечки.
*/

setInterval(
    createHeart,
    900
);


/* =====================================================
   PHOTO PARALLAX — DESKTOP
===================================================== */

const photoHeart =
    document.querySelector(
        ".photo-heart"
    );


if (
    photoHeart &&
    window.matchMedia(
        "(hover: hover)"
    ).matches
) {

    document.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                ) * 2;


            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                ) * 2;


            photoHeart.style.transform =
                `
                rotate(-1deg)
                translate3d(
                    ${x * 4}px,
                    ${y * 4}px,
                    0
                )
                `;

        }
    );
}


/* =====================================================
   TOUCH PARALLAX
===================================================== */

if (photoHeart) {

    document.addEventListener(
        "touchmove",
        event => {

            const touch =
                event.touches[0];


            if (!touch) return;


            const x =
                (
                    touch.clientX /
                    window.innerWidth -
                    0.5
                ) * 2;


            const y =
                (
                    touch.clientY /
                    window.innerHeight -
                    0.5
                ) * 2;


            photoHeart.style.transform =
                `
                rotate(-1deg)
                translate3d(
                    ${x * 2}px,
                    ${y * 2}px,
                    0
                )
                `;

        },
        {
            passive: true
        }
    );
}