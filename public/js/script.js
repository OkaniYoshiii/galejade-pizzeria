"use strict";
{
    const NAV_BTN = document.querySelector('.nav__btn');
    const NAV_LINKS = document.querySelector('.nav__links');
    if (NAV_BTN instanceof HTMLButtonElement && NAV_LINKS !== null) {
        NAV_BTN.addEventListener('click', function () {
            NAV_LINKS.classList.toggle('d-flex');
        });
    }
}
{
    const IMG_CONTAINERS = document.querySelectorAll('.img-fader');
    IMG_CONTAINERS.forEach((imgContainer) => {
        const IMGS = Array.from(imgContainer.querySelectorAll('.fader-img'));
        const TRANSITION_DURATION_IN_MS = 1500;
        IMGS.forEach((img) => {
            img.style.transition = 'opacity ' + TRANSITION_DURATION_IN_MS + 'ms';
        });
        setInterval(() => {
            IMGS[IMGS.length - 1].style.opacity = '0';
            setTimeout(() => {
                IMGS[IMGS.length - 1].style.opacity = '1';
                IMGS.unshift(IMGS[IMGS.length - 1]);
                IMGS.pop();
                IMGS.forEach((img) => imgContainer.appendChild(img));
            }, TRANSITION_DURATION_IN_MS);
        }, 4000);
    });
}
