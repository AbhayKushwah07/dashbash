$(function () {
   //annimation 
   var div1 = $(".signup-content");
  //  var div2 = $("#signup-form");
   
   div1.animate({width: '100%', opacity: '1'}, "slow");
  // toggle eye for signup form
  $(".toggle-password").click(function () {
    $(this).toggleClass("zmdi-eye zmdi-eye-off");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });

  //addmethod for strong password
  $.validator.addMethod(
    "strongPassword",
    function (value, element) {
      return (
        this.optional(element) ||
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`\-={}:";'<>?,.\/]).{8,}$/.test(
          value
        )
      );
    },
    "Mix uppercase, lowercase, numbers, and symbols for a stronger password."
  );

  //add method for valid Indain mobile number
  $.validator.addMethod("mobileIndia", function(phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
    return this.optional(element) || phone_number.length === 10 &&
        phone_number.match(/^[6-9]\d{9}$/);
}, "Please specify a valid mobile number.");

   //add method for valid email
   $.validator.addMethod("emailCustom", function(email, element) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    email = $.trim(email);
    return this.optional(element) || emailPattern.test(email);
}, "Please enter a valid email address.");
  // validation
  $("#signup-form").validate({
    rules: {
      first_name: {
        required: true,
      },
      email: {
        required: true,
        emailCustom:true
      },
      password: {
        required: true,
        strongPassword: true,
      },
      phone: {
        required: true,
        mobileIndia:true
      },
      confirm_password: {
        equalTo: "#password",
      },
      department:{
        required:true
      },
      admin_status:{
        required:true
      }
    },
    messages: {
      password: {
        required: "Please enter a password.",
      },
      email: {
        required: "Please enter a email.",
      },
      confirm_password: {
        equalTo: "password did not match",
      },
      department:{
        required:"select this field"
      },
      admin_status:{
        required:"select this field"
      },
    },
    submitHandler: function () {
      const form = document.getElementById("signup-form");
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData);
      registerUser(userData).then((res) => {
        if (res.status) {
          swal({
            text: res.msg,
            icon: "success",
            button: "OK",
          }).then(() => {
             $(div1).slideUp(()=>{location.href = "/login";});
            
          });
        } else {
          swal({
            text: res.msg,
            icon: "warning",
            button: "Ok",
          });
        }
      });
    },
  });

  //async function for register call
  async function registerUser(data) {
    let res = "";
    await $.ajax({
      type: "post",
      url: "http://127.0.0.1:3333/api/signup",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        res = response;
      },
      error: function (xhr, status, error) {
        console.table(xhr.responseJSON.errors);
        console.error(status); // Log status
        console.error(error); // Log error
      },
    });
    return res;
  }


   
});



    