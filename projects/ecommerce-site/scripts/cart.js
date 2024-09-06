const price = document.querySelector('#price');
const select = document.querySelector('#selector');
const btn = document.getElementById('btn');
const product = document.getElementById('product_name').textContent;

let p = price.textContent.substring(1);

// change price display when change package type 
select.onchange = () => {
    let value = select.value;

    switch(value){
        case "default":
            price.innerHTML = "$121.00";
            p = parseInt(price.textContent.substring(1));
            break;

        case "option1":
            price.innerHTML = "$121.00";
            p = parseInt(price.textContent.substring(1));
            break;
        case "option2":
            price.innerHTML = "$232.00";
            p = parseInt(price.textContent.substring(1));
            break;

        case "option3":
            price.innerHTML = "$343.00";
            p = parseInt(price.textContent.substring(1));
            break;
    }
}


const product_list = [
    {
        id: 0,
        image: "images/small_boxes.jpg",
        title: 'Small Boxes 10" x 10"',
        sub: '10 package',
        price: 121,
        quantity: 0,
    },

    {
        id: 1,
        image: "images/small_boxes.jpg",
        title: 'Small Boxes 10" x 10"',
        sub: '20 package',
        price: 232,
        quantity: 0,
    },

    {
        id: 2,
        image: "images/small_boxes.jpg",
        title: 'Small Boxes 10" x 10"',
        sub: '30 package',
        price: 343,
        quantity: 0,
    }

];

var cart = [];

function addtocart(){
    let value = select.value;

    if(value == "option1"){
        a = 0;}
    else if(value == "option2"){
        a = 1;  }
    else if(value == "option3"){ a = 2;}

    cart.push(product_list[a]);

    let addtocart;

    if(localStorage.getItem('cart')){
        addtocart = JSON.parse(localStorage.getItem('cart'));
    }
    let newcart = Object.assign(cart, addtocart);

    let cart_serial = JSON.stringify(newcart);

    localStorage.setItem('cart', cart_serial);

    console.log(localStorage);
}

