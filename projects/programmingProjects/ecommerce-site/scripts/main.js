let cart_get = localStorage.getItem('cart');
let cart = JSON.parse(cart_get);

function delElement(a){
    cart.splice(a,1);
    displaycart();


}


function displaycart(){
    let j = 0, total = 0;

    document.getElementById('count').innerHTML = cart.length;

    if(cart.length == 0){
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "$" + 0 + ".00";
        localStorage.clear();
    }
    else{
        document.getElementById("cartItem").innerHTML = cart.map((items) => 

        {
            var{image, title,sub, price} = items;
            total = total + price;

            document.getElementById("total").innerHTML = "$" + total + ".00";
            return(
                `<div class = 'cart-item'>
                <div class = 'row-img'> 
                    <img class = 'rowimg' src = ${image}>
                </div>
                <p >${title}</p>
                <h2 >${sub}</h2>

                <h2 >$ ${price}.00</h2>` + 
                "<i class = 'fa-solid fa-trash' onclick ='delElement(" + (j++)+")'></i></div>"
            );
        }).join('');
    }
}


displaycart();
