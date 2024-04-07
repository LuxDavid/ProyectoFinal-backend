const deletButtons = document.getElementsByClassName('deletInCart');

for (const button of deletButtons) {

    button.addEventListener('click', async (e) => {

        const findCart = await fetch(`/api/session/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseUser = await findCart.json();

        await fetch(`/api/carts/${responseUser.result}/product/${button.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return location.reload();
    });
}

const createPaymentIntent = async () => {
    return fetch('/payment-intents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: 500,
            currency: 'mxn'
        })
    })
        .then(res => res.json())
        .then(data => {
            sessionStorage.setItem('stripeClientSecret', data.client_secret);
            document.location.href = "/api/session/finishSale";
        })
        .catch(err => {
            return console.log(err);
        })
}

    document.getElementById('finishSale').addEventListener('click', console.log('click'));


