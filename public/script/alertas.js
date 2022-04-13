function error (texto) {

    let div1 = document.createElement('div');
    div1.classList.add('toast align-items-center text-white bg-primary border-0');
    div1.setAttribute('role', 'alert');
    div1.setAttribute('aria-live', 'assertive');
    div1.setAttribute('aria-atomic', 'true');
    let div2 = document.createElement('div');
    div2.classList.add('d-flex');
    let div3 = document.createElement('div');
    div3.classList.add('toast-body');
    div3.appendChild(document.textContent("texto"));
    div2.appendChild(div3);
    div1.appendChild(div2);
    document.body.appendChild(div1);
}

function info (texto) {

    let div1 = document.createElement('div');
    div1.classList.add('toast align-items-center text-white bg-success border-0');
    div1.setAttribute('role', 'alert');
    div1.setAttribute('aria-live', 'assertive');
    div1.setAttribute('aria-atomic', 'true');
    let div2 = document.createElement('div');
    div2.classList.add('d-flex');
    let div3 = document.createElement('div');
    div3.classList.add('toast-body');
    div3.appendChild(document.textContent("texto"));
    div2.appendChild(div3);
    div1.appendChild(div2);
    document.body.appendChild(div1);
}

export {error,info};