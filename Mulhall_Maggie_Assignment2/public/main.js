let butt = document.getElementById('purchasebutton')
butt.addEventListener("click",() => {
    window.location.assign("login.html");
});

document.getElementById('register').addEventListener('click', () => {
    const response = await fetch('/register', {
        method: 'POST',
        body: JSON.stringify({
            name: document.getElementById("un").value,
            password: document.getElementById("pw").value,
            email: document.getElementById("email").value
        })
    });

});