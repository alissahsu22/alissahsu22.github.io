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


// hold quantity 
var cart = {
    '10" x 10" Boxes':{
        "option1":0,
        "option2":0,
        "option3":0},

    "m": {"option1":0,
           "option2":0,
           "option3":0},
};

var price_list = {
    '10" x 10" Boxes':{
        "option1":0,
        "option2":0,
        "option3":0},

    "m": {"option1":0,
           "option2":0,
           "option3":0},
};




function storeData(){
    // store total 
    let total = calculateTotal();


    let total_serial = JSON.stringify(total);
    localStorage.setItem("total",total_serial);


    // store cart
    let cart_serial = JSON.stringify(cart);
    localStorage.setItem("cart",cart_serial);

    console.log(localStorage);
}

function calculateTotal(){
    var total = 0;

    // key = product name       value = nested dict 
    for (const [key, value] of Object.entries(cart)) {
        for (const [key1, value1] of Object.entries(cart[key])) {
            total += ( cart[key][key1] * price_list[key][key1]);
      }
    }
    return total;
}

function addtocart(){
    let curr_quantity = parseInt(document.getElementById('quantity').value);

    cart[product][select.value] += (1*curr_quantity);

    price_list[product][select.value] = p;

    storeData();
}


