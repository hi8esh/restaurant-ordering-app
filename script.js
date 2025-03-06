import { menuArray } from './data.js'
console.log(menuArray)

let cart = [] // This array will hold the items added to the cart

document.addEventListener("click", function(e) {
    console.log(e)
    // Addig an item to the cart whenn the add button is clicked
    if (e.target.classList.contains("btn-container") || e.target.parentElement.classList.contains("btn-container")){
        const btnContainer = e.target.classList.contains("btn-container") ? e.target : e.target.parentElement
        addToCart(btnContainer.dataset.id)
    }
    // decrement quantity of item in cart
    else if (e.target.id === "decrement-btn"){
        upadteQuantity(e.target.dataset.id, -1)
    }
    // increment quantity of item in cart
    else if (e.target.id === "increment-btn"){
        upadteQuantity(e.target.dataset.id, 1)
    }
    // close checkout card when the close buttonn is clicked
    else if (e.target.id === "form-close-btn"){
        closeCheckoutCard()
    }
    else if (e.target.id === "complete-order-btn"){
        renderCheckoutCard()
    }
    // else if (e.target.id === "submit-payment-btn"){
    //     submitPayment()
    // }
})

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const total = getTotal();

    // Hide your orders section
    document.getElementById('orders').style.display = 'none';

    // Show the thank you message with name and total
    document.getElementById('thank-you').style.display = 'block';
    document.getElementById('thank-you-text').textContent = `Thanks ${name}!, Your payment of $${total} has been received. Your Order is on its way.`;

    
    document.getElementById('payment-form').reset();
    document.getElementById('checkout-card').style.display = 'none';
});

function renderCheckoutCard() {
    document.getElementById('checkout-card').style.display = 'block';
    document.body.classList.add('block-background')  // Disable interaction with background
}

function closeCheckoutCard() {
    document.getElementById("checkout-card").style.display = 'none'
    document.body.classList.remove('block-background')  // Allow background interaction again
}

function addToCart(id){
    const itemId = parseInt(id)
    const targetItem = menuArray.find(item => item.id === itemId)

    // check if the item is already in the cart
    const existingItemIndex = cart.findIndex(item => item.id === itemId)
    // increase quantity if exists
    if (existingItemIndex !== -1){
        cart[existingItemIndex].quantity += 1
    }
    // add if not exists with initial quantity of 1
    else{
        cart.push({...targetItem, quantity: 1})
    }
    renderOrder()
}

function upadteQuantity(id, change){
    const itemId = parseInt(id)
    const targetItem = cart.find(item => item.id === itemId)

    if (targetItem){
        targetItem.quantity += change
        // remove item if quantity is 0 or below
        if (targetItem.quantity <= 0){
            cart = cart.filter(item => item.id !== itemId)
        }
    }
    renderOrder()
}

function render() {
    const items = document.getElementById('items')
    let itemsDetails = ``
    
    menuArray.forEach(function(item) {
        itemsDetails += `
                        <div class="item-container">
                            <!-- Render Items -->
                            <div class="item">
                                <div class="emoji">${item.emoji}</div>
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-ingredients">${item.ingredients.join(", ")}</div>
                                    <div class="item-price">$${item.price}</div>
                                </div>
                                <div class="btn-container" data-id="${item.id}">
                                    <div id="add-btn" class="add-btn">+</div>
                                </div>
                            </div>
                        </div>
                        `
    })
    items.innerHTML = itemsDetails
}

function renderOrder(){
    const orderItems = document.getElementById('order-items')
    const orders = document.getElementById('orders')
    let orderDetails = ``

    // Render all items in the cart
    cart.forEach( item => {
        orderDetails += `
                        <div class="order-item">
                            <div class="order-name">${item.name}</div>
                            <div class="order-quantity">
                                <div class="quantity-btn" id="decrement-btn" data-id="${item.id}">-</div>
                                <div class="quantity">${item.quantity}</div>
                                <div class="quantity-btn" id="increment-btn" data-id="${item.id}">+</div>
                            </div>
                            <div class="order-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        `
    })

    // Insert the order details to the order container
    orderItems.innerHTML = orderDetails
    // update the total price of the cart
    document.getElementById('total-price').textContent = `$${getTotal().toFixed(2)}`

    // if the cart is empty, hide the order section
    if(cart.length === 0){
        orders.style.display = 'none'
    }
    // show orders section when cart is not empty
    else{
        orders.style.display = 'block'
    }

}

function getTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

render()