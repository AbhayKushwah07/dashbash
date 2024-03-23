$(function () {
  //annimation
  var loginCon = $('.wrapper')
  loginCon.animate({ opacity: '0.4'}, "slow");
  loginCon.animate({ opacity: '1'}, "slow");

  // add event on login button to handle login request
  $("#loginBtn").click(function () {
    let loginForm = document.getElementById("login_form");
    let loginData = new FormData(loginForm);
    let user = Object.fromEntries(loginData);
  // login request call
    $.ajax({
      type: "post",
      url: "/api/login",
      data: JSON.stringify(user),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        if (response.status) {
          swal({
            text: "Login Successfully",
            icon: "success",
            button: "OK",
          }).then(() => {
            $.ajax({
              type: "get",
              url: `/api/fetchUser/${user.username}`,
              dataType: "json",
              success: function (response) {
                let name = `${response.data[0].first_name} ${response.data[0].last_name}`;
                let username = `${response.data[0].email}`;
                localStorage.setItem("name", name);
                localStorage.setItem("username", username);
              },
            });
            if (response.adminStatus) {
              location.href = "/dashboard";
            } else {
              location.href = "/userdash";
            }
          });
        } else {
          swal({
            text: response.msg,
            icon: "warning",
            button: "Ok",
          });
        }
      },
      error: function (xhr, status, error) {
        console.table(xhr.responseJSON.errors);
        console.error(status); // Log status
        console.error(error); // Log error
      },
    });
  });
});
