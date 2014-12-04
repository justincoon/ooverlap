function jQuery_BindLogin(){
    $('#login').bind('click',
        function(event){
            var email = $('#login_email').val();
            var password = $('#login_pwd').val();
            $.ajax({
                type: 'POST',
                url: '/auth/login',
                data: {
                    email: email,
                    password: password
                }
            }).done(function(msg) {
                if (msg.error){
                    generate('Email and password is not matched','error');
                } else {
                    window.location.replace("/user/profile");
                }
            });
        });
}

function generate(text, type) {
    var n = noty({
        text: text,
        type: type,
        dismissQueue: true,
        layout: 'topCenter',
        theme: 'defaultTheme',
        timeout: 5000,
        maxVisible: 10
    });
}

$(document).ready(function() {
	$(function(){
        // Calling Login Form
        $("#login_form").click(function(){
            $(".social_login").hide();
            $(".user_login").show();
            return false;
        });

        // Calling Register Form
        $("#register_form").click(function(){
            $(".social_login").hide();
            $(".user_register").show();
            $(".header_title").text('Register');
            return false;
        });

        // Going back to Social Forms
        $(".back_btn").click(function(){
            $(".user_login").hide();
            $(".user_register").hide();
            $(".social_login").show();
            $(".header_title").text('Login');
            return false;
        });
    });
    // jQuery_BindSignUp();
    jQuery_BindLogin();
});