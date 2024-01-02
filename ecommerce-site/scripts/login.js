const login_btn = document.getElementById("login-btn");
const register_btn = document.getElementById("register-btn");

login_btn.style.color = "red";


var loginform = document.getElementById("login-form");
var regform = document.getElementById("register-form");

function activate(i){
    if(i==0){
        login_btn.style.color = "red";
        register_btn.style.color = "black";
        login();
    }
    else{
        login_btn.style.color = "black";
        register_btn.style.color = "red";
        register();
    }
}


function register(){
    regform.style.transform = "translateX(300px)";
    loginform.style.transform = "translateX(300px)";
    
}

function login(){
    regform.style.transform = "translateX(0px)";
    loginform.style.transform = "translateX(0px)";
}