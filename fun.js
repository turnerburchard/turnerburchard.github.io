
const landingButton = document.getElementById('landingButton');
const landing = document.getElementById('landing');

landing.addEventListener('click', function handleClick(event) {
    changeScroll();
    landing.remove();
});

function changeScroll(){
    const body = document.getElementById('body')
    body.style.overflow = "auto";
}
