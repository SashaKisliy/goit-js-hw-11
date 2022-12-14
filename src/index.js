const hello = document.querySelector('.title');
const btn = document.querySelector('button')

btn.addEventListener('click', e => {
    const hi = e.currentTarget;
    console.log(hi)
})