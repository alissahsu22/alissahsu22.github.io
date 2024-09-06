const search = () => {
    const searchbox = document.getElementById("search-item").value;
    const storeitems = document.getElementById("product-list");
    const product = document.querySelectorAll(".product");
    const pname = document.getElementsByTagName("h5");

    for(var i = 0; i < pname.length; i++){
        let match = product[i].getElementsByTagName("h5")[0];
        

        if(match){
            let textvalue = match.textContent || match.innerHTML;

            if(textvalue.indexOf(searchbox) > -1){
                product[i].style.display = "";
            }
            else{
                console.log("");
                product[i].style.display = "none";
            }
        }
    }


}