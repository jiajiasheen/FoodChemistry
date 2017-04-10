//Toggle between login, registeration, payment form
function toregister() {
    document.getElementById('register_form').style.display = "block";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('card_form').style.display = "none";
    document.getElementById('paypal_form').style.display = "none";
    document.getElementById('bankaccount_form').style.display = "none";
}

function tologin() {
    document.getElementById('register_form').style.display = "none";
    document.getElementById('login_form').style.display = "block";
    document.getElementById('card_form').style.display = "none";
    document.getElementById('paypal_form').style.display = "none";
    document.getElementById('bankaccount_form').style.display = "none";
}

function tocard() {
    document.getElementById('register_form').style.display = "none";
    document.getElementById('card_form').style.display = "block";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('paypal_form').style.display = "none";
    document.getElementById('bankaccount_form').style.display = "none";
}

function topaypal() {
    document.getElementById('register_form').style.display = "none";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('card_form').style.display = "none";
    document.getElementById('paypal_form').style.display = "block";
    document.getElementById('bankaccount_form').style.display = "none";
}

function tobankaccount() {
    document.getElementById('register_form').style.display = "none";
    document.getElementById('login_form').style.display = "none";
    document.getElementById('card_form').style.display = "none";
    document.getElementById('paypal_form').style.display = "none";
    document.getElementById('bankaccount_form').style.display = "block";
}

function validation() {
    var username = document.getElementById("regusername").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("regpassword").value;
    var password2 = document.getElementById("password2").value;
    var usertype = document.getElementById("usertype").value;
    
    var regex = /^([a-zA-Z0-9]{6,8})$/; //username should be alphanumeric 6~8 letters
    var result = regex.test(username);
    
    var regex2 = /^([a-zA-Z0-9]{8,10})$/; //password should be alphanumeric 8~10 letters
    var result2 = regex2.test(password);
    
    var regex3 = /^([a-zA-Z\.]+\b@mail\.utoronto\.ca\b|[a-zA-Z\.]+\b@teach\.cs\.utoronto\.ca\b)$/; //u of t email   
    var result3 = regex3.test(email);
    
    //when user didn't fill out all of the required information, alert it to user
    if (username == "" || email == "" || password == "" || password2 == "") {
        alert("Please type all the information")
    }
    //when user didn't input information as required format, alert it to user
    else if (!result) {
        alert("Please retype username");
    }
    else if (!result2) {
        alert("Password should be 8~10 characters");
    }
    else if (!result3) {
        alert("Please retype email");
    }
    //check if retyped password matches with password
    else if (password != password2) {
        alert("Please retype password");
    }
    //all the requirements has been met, user is food truck owner, get bank account
    else if (usertype == "owner") {
        tobankaccount();
    }
    //all the requirements has been met, user is customer, get credit card/paypal
    else {
        tocard();
    }
}

function toverify() {
    var name = document.getElementById("name").value;
    var account = document.getElementById("number").value;
    var expiration = document.getElementById("expiration").value;
    var address = document.getElementById("address").value;
    var location = document.getElementById("location").value;
    var zipcode = document.getElementById("zipcode").value;
    
    var regex = /^([a-zA-z]+[ ][a-zA-z]+)$/;
    var nametest = regex.test(name);
    
    var regex2 = /^([0-9]{16})$/;
    var accounttest = regex2.test(account);
    
    var regex3 = /^([0][1-9][\/][1-2][0-9]|[1][0-2][\/][1-2][0-9])$/;
    var expirationtest = regex3.test(expiration);
    
    var regex4 = /^([a-zA-Z]+[,][a-zA-Z]+)$/;
    var locationtest = regex4.test(location);
    
    var regex5 = /^([a-zA-Z0-9]{3}[ ][a-zA-Z0-9]{3}|[a-zA-Z0-9]{3}[a-zA-Z0-9]{3})$/;
    var zipcodetest = regex5.test(zipcode);
    
    //when user didn't fill out all of the required information, alert it to user
    if (name == "" || account == "" || expiration == "" || address == "" || location == "" || zipcode == "") {
        alert("Please type all required information");
    }
    else if (!nametest) {
        alert("Please retype name");
    }
    else if (!accounttest) {
        alert("Please retype account number");
    }
    else if (!expirationtest) {
        altert("please retype expiration date in mm/yy");
    }
    else if (!locationtest) {
        alert("Please retype in city,province");
    }
    else if (!zipcodetest) {
        alert("Please retype zipcode");
    }
    //all of the requirements has been met
    else {
        //reset textbox
        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
        document.getElementById("expiration").value = "";
        document.getElementById("address").value = "";
        document.getElementById("location").value = "";
        document.getElementById("zipcode").value = "";
        document.getElementById("regusername").value = "";
        document.getElementById("email").value = "";
        document.getElementById("regpassword").value = "";
        document.getElementById("password2").value = "";
        document.getElementById("paypalemail").value = "";
        document.getElementById("paypalpassword").value = "";
        //goes back to login page
        tologin();
    }
}

function toverify2() {
    var paypalemail = document.getElementById("paypalemail").value;
    var paypalpassword = document.getElementById("paypalpassword").value;
    //when user didn't fill out all of the required information, alert it to user
    if (paypalemail == "" || paypalpassword == "") {
        alert("Please type all the required information");
    }
    else {
        //reset textbox
        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
        document.getElementById("expiration").value = "";
        document.getElementById("address").value = "";
        document.getElementById("location").value = "";
        document.getElementById("zipcode").value = "";
        document.getElementById("regusername").value = "";
        document.getElementById("email").value = "";
        document.getElementById("regpassword").value = "";
        document.getElementById("password2").value = "";
        document.getElementById("paypalemail").value = "";
        document.getElementById("paypalpassword").value = "";
        //goes back to login page
        tologin();
    }
}

function toverify3() {
    var name = document.getElementById("accountname").value;
    var account = document.getElementById("accountnumber").value;
    var branchnumber = document.getElementById("branch").value;
    var address = document.getElementById("accountaddress").value;
    var location = document.getElementById("accountlocation").value;
    var zipcode = document.getElementById("accountzipcode").value;
    
    var regex = /^([a-zA-z]+[ ][a-zA-z]+)$/;
    var nametest = regex.test(name);
    
    var regex2 = /^([0-9]{16})$/;
    var accounttest = regex2.test(account);
    
    var regex3 = /^([0-9]{8})$/;
    var branchtest = regex3.test(branchnumber);
    
    var regex4 = /^([a-zA-Z]+[,][a-zA-Z]+)$/;
    var locationtest = regex4.test(location);
    
    var regex5 = /^([a-zA-Z0-9]{3}[ ][a-zA-Z0-9]{3}|[a-zA-Z0-9]{3}[a-zA-Z0-9]{3})$/;
    var zipcodetest = regex5.test(zipcode);
    
    //when user didn't fill out all of the required information, alert it to user
    if (name == "" || account == "" || branchnumber == "" || address == "" || location == "" || zipcode == "") {
        alert("Please type all required information");
    }
    else if (!nametest) {
        alert("Please retype name");
    }
    else if (!accounttest) {
        alert("Please retype account number");
    }
    else if (!branchtest) {
        altert("please retype branch number");
    }
    else if (!locationtest) {
        alert("Please retype in city,province");
    }
    else if (!zipcodetest) {
        alert("Please retype zipcode");
    }
    //all of the requirements has been met
    else {
        //reset textbox
        document.getElementById("accountname").value = "";
        document.getElementById("accountnumber").value = "";
        document.getElementById("branch").value = "";
        document.getElementById("accountaddress").value = "";
        document.getElementById("accountlocation").value = "";
        document.getElementById("accountzipcode").value = "";
        document.getElementById("regusername").value = "";
        document.getElementById("email").value = "";
        document.getElementById("regpassword").value = "";
        document.getElementById("password2").value = "";
        //goes back to login page
        tologin();
    }
}