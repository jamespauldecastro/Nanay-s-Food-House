//Add to cart function.
function addToCart(productId, productName, productPrice, productImage) {
    const currentUser = localStorage.getItem('currentUser');

    //Create an object to represent the item.
    const newItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: productImage
    };

    //Get existing cart items from localStorage for the current userr.
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];

    //Check if item already exists in cart.
    let itemExists = false;
    cart = cart.map(item => {
        if (item.id === newItem.id) {
            item.quantity++; //Increase quantity if item exists.
            itemExists = true;
        }
        return item;
    });

    if (!itemExists) {
        cart.push(newItem); //Add new item to cart if it doesn't exist.
    }

    //Update localStorage with updated cart.
    localStorage.setItem(currentUser + '_cart', JSON.stringify(cart));

    //Update the display.
    updateCart();
}

//Method to update the cart and checkout form display.
function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartDeliveryFeeElement = document.getElementById('cart-delivery-fee');
    const cartTotalElement = document.getElementById('cart-total');

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }

    //Get cart items for the current user.
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];
    let cartHtml = '';
    let cartSubtotal = 0;
    let cartDeliveryFee = cart.length > 0 ? 50 : 0; //Fixed delivery fee.
    let cartTotal = 0;

    cart.forEach((item, index) => {
        cartHtml += `<li style="display: flex !important; background-color: #BD946D !important; border-radius: 10px !important; border: 2px solid #BD946D !important;">
    <img src="${item.image}" alt="${item.name}" style="width: 100px !important; border-radius: 10px 0 0 10px !important;">
    <div style="display: flex !important; flex-direction: column !important; height: 100% !important; align-self: center !important; gap: 10px !important; margin-left: 3px !important; width: 100%;">
        <p style="font-weight: bold !important; text-align: left !important; color: black !important;">${item.name}</p>
        ${item.price.toFixed(2)}
        <button class="remove-item" data-index="${index}" style="display: flex !important; height: fit-content !important; background-color: transparent !important; border: none !important; align-items: flex-start !important;">
            <img src="images/rubbish-bin.png" alt="remove button">
        </button>
    </div> 
    <div style="display: flex !important; flex-direction: column !important; justify-content: center !important; margin-left: 200px !important; align-items: center !important;">
        <button class="quantity-btn increase" data-index="${index}" style="height: 30px !important; width: 35px !important; border-radius: 5px !important; border: 1px solid #4B1E13 !important; background-color: #BD946D !important;">+</button>
        <h4 style="padding: 5px !important; background-color: transparent !important; width: 100% !important; text-align: center !important; color: black !important;">${item.quantity}</h4>
        <button class="quantity-btn decrease" data-index="${index}" style="height: 30px !important; width: 35px !important; border-radius: 5px !important; border: 1px solid #4B1E13 !important; background-color: #BD946D !important;">-</button>
    </div>
</li>
`;
        cartSubtotal += item.price * item.quantity;
    });

    cartTotal = cartSubtotal + cartDeliveryFee;

    cartItemsElement.innerHTML = cartHtml;
    cartSubtotalElement.textContent = `${cartSubtotal.toFixed(2)}`;
    cartDeliveryFeeElement.textContent = `${cartDeliveryFee.toFixed(2)}`;
    cartTotalElement.textContent = `${cartTotal.toFixed(2)}`;

    const checkoutButton = document.getElementById('proceed-to-checkout');
    //Disable checkout and clear button if cart is empty.
    if (cart.length === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }

    //Add event listeners to quantity buttons.
    const decreaseButtons = document.querySelectorAll('.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            decreaseQuantity(index);
        });
    });

    const increaseButtons = document.querySelectorAll('.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            increaseQuantity(index);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            removeItem(index);
        });
    });
}

//Function to decrease item quantity.
function decreaseQuantity(index) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem(currentUser + '_cart', JSON.stringify(cart));
        updateCart();
    }
}

//Function to increase item quantity.
function increaseQuantity(index) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];
    if (cart[index]) {
        cart[index].quantity++;
        localStorage.setItem(currentUser + '_cart', JSON.stringify(cart));
        updateCart();
    }
}

//Function to remove an item from the cart.
function removeItem(index) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem(currentUser + '_cart', JSON.stringify(cart));
        updateCart();
    }
}

//Event listener for adding items to cart.
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const image = this.getAttribute('data-image');
        addToCart(id, name, price, image);
    });
});

//Event listener for closing the cart.
document.getElementById('close-cart').addEventListener('click', function () {
    document.querySelector('.cart').classList.remove('show');
});

document.getElementById('cart-btn').addEventListener('click', function () {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please sign in first.');
    } else {
        document.querySelector('.cart').classList.add('show');
    }
});

//Function to open checkout form and populate with cart items.
function openCheckout() {
    const cartItemsElement = document.getElementById('cart-items-checkout');
    const cartSubtotalElement = document.getElementById('cart-subtotal-checkout');
    const cartDeliveryFeeElement = document.getElementById('cart-delivery-fee-checkout');
    const cartTotalElement = document.getElementById('cart-total-checkout');

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }

    //Get cart items for the current user.
    let cart = JSON.parse(localStorage.getItem(currentUser + '_cart')) || [];
    let cartHtml = '';
    let cartSubtotal = 0;
    let cartDeliveryFee = cart.length > 0 ? 50 : 0; // Fixed delivery fee
    let cartTotal = 0;

    cart.forEach(item => {
        cartHtml += `<ul style="display:flex; margin-bottom: 10px; background-color: #BD946D; padding:5px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100px;">
            <div style="display:flex; flex-direction: column; justify-content: space-between; width: 150px;"><p style="font-weight: bold; margin-left:5px;">${item.name}</p> ${item.price} </div>
            <span style="margin-left:120px; text-align:center; ">Quantity: ${item.quantity}</span>
        </ul>`;
        cartSubtotal += item.price * item.quantity;
    });

    cartTotal = cartSubtotal + cartDeliveryFee;

    // Store total in localStorage
    localStorage.setItem('cartTotal', cartTotal.toFixed(2));

    cartItemsElement.innerHTML = cartHtml;
    cartSubtotalElement.textContent = `${cartSubtotal.toFixed(2)}`;
    cartDeliveryFeeElement.textContent = `${cartDeliveryFee.toFixed(2)}`;
    cartTotalElement.textContent = `${cartTotal.toFixed(2)}`;

    document.querySelector('.floating-checkout').style.display = 'block'; //Show checkout form.
}

// Function to clear the cart for the current user.
function clearCart() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.error('No user is logged in.');
        return;
    }
    localStorage.removeItem(currentUser + '_cart');
    updateCart();
}

//Event listener for proceeding to checkout.
document.getElementById('proceed-to-checkout').addEventListener('click', function () {
    openCheckout();
});

//Event listener for closing the checkout form
document.getElementById('close-checkout').addEventListener('click', function () {
    document.querySelector('.floating-checkout').style.display = 'none';
});

//Event listener for placing order (submitting the checkout form)
document.getElementById('checkout-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const paymentMethod = document.getElementById('payment-method').value;

    if (paymentMethod === 'gcash') {
        // Redirect to GCash payment form
        clearCart();
        window.location.href = 'gcashpaymentform.html';
    } else {
        // Handle order placement for other payment methods
        alert('Order placed successfully!');
        clearCart();
        document.querySelector('.floating-checkout').style.display = 'none';
    }
});

//Initial update of cart display
updateCart();

//Add to cart notification
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.add-to-cart');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-name');
            const notification = button.closest('.price-and-add-to-cart').querySelector('.notification');

            const hasCurrentUser = localStorage.getItem('currentUser') !== null;
            if (hasCurrentUser) {
                notification.textContent = `${productName} has been added to the cart successfully!`;
            } else {
                notification.textContent = 'Please sign in first.';
            }

            notification.style.display = 'block';

            setTimeout(function () {
                notification.style.display = 'none';
            }, 1500);
        });
    });
});


//Function to manege burger menu (the nav bar) in mobile mode.
let menuList = document.getElementById("menuList");
menuList.style.maxHeight = "0px";

function toggleMenu() {
    if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "300px";
    } else {
        menuList.style.maxHeight = "0px";
    }
}

//Popuate the Name and Email based on the current user.
function populateCheckoutForm() {
    console.log('Populate Checkout Form called');
    const fullName = localStorage.getItem('userName');
    const email = localStorage.getItem('currentUser');

    if (fullName && email) {
        document.getElementById('fullname').value = fullName;
        document.getElementById('email').value = email;
    }
}

document.getElementById('proceed-to-checkout').addEventListener('click', function () {
    document.querySelector('.floating-checkout').style.display = 'block';
    populateCheckoutForm();
});

//Log Out Function.
function logOut() {
    const isConfirmed = confirm('Are you sure you want to log out?');

    if (isConfirmed) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userName');

        window.location.href = 'sign-in.html';
    }
}
//Makes sure that log out function is accessible in every pagee.
window.logOut = logOut;


//Update the navigation bar if a user login or logout.
function updateNav() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const signInNav = document.querySelector('nav ul li a[href="sign-in.html"]');

    if (isLoggedIn) {
        if (signInNav) {
            signInNav.textContent = 'Log out';
            signInNav.href = '#'; //Set href to '#' to prevent navigation.
            signInNav.setAttribute('onclick', 'logOut()');
        }
    } else {
        if (signInNav) {
            signInNav.textContent = 'Sign In';
            signInNav.href = 'sign-in.html';
            signInNav.removeAttribute('onclick');
        }
    }
}

window.addEventListener('DOMContentLoaded', updateNav);