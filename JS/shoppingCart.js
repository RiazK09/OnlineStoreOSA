/*************** Welcome ***************/

/*************** jQuery ***************/

//This will access all the buttons with a class of 'btn-primary'
$(".btn-primary").click(function (event) {
    event.preventDefault();
    let name = $(this).attr("data-name");
    let price = Number($(this).attr("data-price"));

    addItemToCart(name, price, 1);
    displayCart();
});

$("#clear-cart").click(function (event) {
    clearCart();
    displayCart();
});

//Display Cart function
function displayCart() {
    let cartArray = listCart();
    let output = "";
    for (let i in cartArray) {
        output += "</br>" +
            "<li class='product-title'>" + cartArray[i].name + "</li>" +
            "<li class='price'>" + cartArray[i].count + "</li>" +
            "<li class='quantity'>" + cartArray[i].price + "</li>" +
            "<li class='total'>" + cartArray[i].total + "</li>" +
            "<li>" + "<div class= 'quickBtns'>" +
            " <button class='plus-item' data-name='" +
            cartArray[i].name + "'>+</button>" +
            " <button class='subtract-item' data-name='" +
            cartArray[i].name + "'>-</button>" +
            " <button class='delete-item' data-name='" +
            cartArray[i].name + "'>X</button>"
    };
    $("#show-cart").html(output); //Displays the code above ('output') on cart.html
    $("#count-cart").html(countCart()); //Displays cart 'count' in nav
    $("#count-cart2").html(countCart()); //Displays cart 'count' before subtotal
    $("#subtotal-cart").html(totalCart()); //Display subtotal
};

//Removes item completely
$("#show-cart").on("click", ".delete-item", function (event) {
    let name = $(this).attr("data-name");
    removeItemFromCartAll(name);
    displayCart();
});

//-1 Item
$("#show-cart").on("click", ".subtract-item", function (event) {
    let name = $(this).attr("data-name");
    removeItemFromCart(name);
    displayCart();
});

//+1 Item
$("#show-cart").on("click", ".plus-item", function (event) {
    let name = $(this).attr("data-name");
    addItemToCart(name, 0, 1);
    displayCart();
});

//Displays item qty
$("#show-cart").on("change", ".item-count", function (event) {
    let name = $(this).attr("data-name");
    let count = Number($(this).val());
    setCountForItem(name, count);
    displayCart();
});

/*************** Shopping Cart functions ***************/

//Empty Array - When you start shopping cart is empty
let cart = [];

//Constructor function
let Item = function (name, price, count) {
    this.name = name
    this.price = price
    this.count = count
};

//This function will add an item to the cart
function addItemToCart(name, price, count) {
    for (let i in cart) {
        if (cart[i].name === name) {
            cart[i].count += count; //(+= refers to + count)
            alert("Cart Total: R" + totalCart() + " excl. VAT"); //Alert to display current total(excl. VAT) when item is added.
            saveCart();
            return; //if satisfied, this will end function and break the loop here!
        };
    };
    if(cart == null)
    cart = [];
    let item = new Item(name, price, count);
    cart.push(item); //Adds item to the end of cart
    alert("Cart Total: R" + totalCart() + " excl. VAT"); //Alert to display current total (excl. VAT) when item is added.
    saveCart();
};

//This function allows you to manually set the count for a particular item
function setCountForItem(name, count) {
    for (let i in cart) {
        if (cart[i].name === name) {
            cart[i].count = count; // !STRING
            break;
        };
    };
    saveCart();
};

//This function removes one item from the cart - it will remove item by looking up the name of the item
function removeItemFromCart(name) {
    for (let i in cart) {
        if (cart[i].name === name) {
            cart[i].count--; // (--) refers to minus 1
            if (cart[i].count === 0) { //This if statement will remove the item before it can go into the negative
                cart.splice(i, 1);
            };
            break;
        };
    };
    saveCart();
};

//This function removes all of an item
function removeItemFromCartAll(name) {
    for (let i in cart) {
        if (cart[i].name === name) {
            cart.splice(i, 1);
            break;
        };
    };
    saveCart();
};

//This function will clear the cart
function clearCart() {
    cart = [];
    saveCart();
};

//This function returns the total count
function countCart() {
    let totalCount = 0;
    for (let i in cart) {
        totalCount += cart[i].count;
    };
    return totalCount;
};

//This function returns the total cost of the cart
function totalCart() {
    let totalCost = 0;
    for (let i in cart) {
        totalCost += cart[i].price * cart[i].count;
    };
    return totalCost.toFixed(2); //toFixed converts number to string and rounds off to 2 decimal places 
};

//This function will return an Array of items
function listCart() {
    let cartCopy = [];
    for (let i in cart) {
        let item = cart[i];
        let itemCopy = {};
        for (let p in item) { // p for property
            itemCopy[p] = item[p];
        };
        itemCopy.total = (item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy);
    };
    return cartCopy;
};

//This function is going to save the cart information to the local Storage
function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart)); //Array converted to string!
};

//This function is going to load the cart information from the local Storage
function loadCart() {
    cart = JSON.parse(localStorage.getItem("shoppingCart"));
};

let grandTotal;
let text;

// Add shipping and VAT
function shippingTotal() {
    let shipping = document.getElementById("selectValue").value;
    let text;
    switch (shipping) {
        case "Standard-delivery - between 7-10 days: (R50)":
            text = (Number(totalCart()) + 50);
            grandTotal = Number(text * 1.15);
            break;
        case "Express-delivery - between 24-48 Hours: (R100)":
            text = (Number(totalCart()) + 100);
            grandTotal = Number(text * 1.15);
            break;
        case "Collection in store: free":
            text = Number(totalCart());
            grandTotal = Number(text * 1.15);
            break;
        default:
            text = " Please choose an option...";
    }
    document.getElementById("shippingOut").innerHTML = text.toFixed(2);
    document.getElementById("total-cart").innerHTML = grandTotal.toFixed(2);
}

//Discount function
function applyDiscount() {
    if (document.getElementById("disCode").value.toUpperCase() == "OSA1") { //Coupon Code = OSA1
        let disAmt = 0.85 * grandTotal;
        document.getElementById("disOut").innerHTML = "15% Discount Applied - New Grand Total due: R" + (disAmt).toFixed(2) + " incl. VAT" + "";
    } else {
        document.getElementById("disOut").innerHTML = "Sorry, invalid discount code entered!";
    };
};

//This function generates a reference number
var invoice;

function referenceNumber() {
    invoice = Math.floor(Math.random() * 10000) + 1; //Random number from 0-9999
    return invoice;
};

//This function will display an alert when the confirm order button is clicked!
function checkoutAlert() {
    if (totalCart() > 0) {
        alert(
            "Your order has been successfully placed. \n" +
            "Your reference number is #" + referenceNumber() + "."
        );
    } else {
        alert("Your cart is currently empty."); //If cart is empty - This message will be displayed in an alert
    }
}

loadCart();
displayCart();

/*************** jQuery functionality (Rest of site) ***************/

$(document).ready(function () {

    //This will hide/show additional reviews on the homepage
    $('#viewMoreReviews').on('click', function () {
        $('#moreReviews1, #moreReviews2').toggle();
    });

    //Accordion animation  - Drop down Menu on Homepage only!
    $(".main li").hover( //class + element
        function () {
            $("ul.sub", this).slideDown(500); //element + class where: <ul> == element & .sub == class
        },
        function () {
            $("ul.sub", this).slideUp(300);
        },
    );

    //This function will change the background colour of the Gallery section - (Animation utilised)
    setInterval(function () {
        //Chained effect utilised
        $('.Gallery').animate({
            backgroundColor: 'teal',
        }, 2000).animate({
            backgroundColor: 'purple',
        }, 2000).animate({
            backgroundColor: 'navy',
        }, 2000);
    });
});