$(function () {
  // animation
  let table = $(".table-responsive");
  $(table).hide();
  $(table).show(700);

  let name = localStorage.getItem("name"); //get name
  let username = localStorage.getItem("username"); // get email
  if (!username) {
    swal({
      text: "Login first",
      icon: "warning",
      button: "OK",
    }).then(() => {
      location.href = "/login";
    });
  } else {
    fetchUsers(); //fetch users
    $("#empName").html(name); // set name
    //forgot password event handler
    $("#forgot-password").click(function () {
      if (!username) {
        swal({
          text: "Login first",
          icon: "warning",
          button: "OK",
        }).then(() => {
          $("#closemodal3").click();
        });
      } else {
        $("#username1").val(username);

        $("#username1").prop("disabled", true);
        $("#cp-form").submit(function (e) {
          e.preventDefault();

          let formData = new FormData(this);
          let data = Object.fromEntries(formData);
          data.username = username;
          $.ajax({
            type: "post",
            url: "/api/changePassword",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
              if (res.status) {
                swal({
                  text: res.msg,
                  icon: "success",
                  button: "OK",
                }).then(() => {
                  $("#closemodal3").click();
                  fetchUsers();
                });
              } else {
                swal({
                  text: res.msg,
                  icon: "warning",
                  button: "Ok",
                });
              }
            },
          });
        });
      }
    });

    /* logout action*/
    $("#logout").click(function () {
      localStorage.clear();
      location.href = "/login";
    });

    /* select all checkbox event*/
    $("#select-all").change(function () {
      $('input[type="checkbox"]').prop("checked", $(this).prop("checked"));
    });

    //delete multiple users event
    $("#delete-multiple").click(function (e) {
      var Ids = [];
      $('input[type="checkbox"]:checked').each(function (index) {
        if ($(this).attr("data-id")) {
          var dataId = $(this).attr("data-id");
          Ids.push(dataId);
        }
      });

      swal({
        title: "Are you sure?",
        text: "Do you want to delete selected users",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal(`${Ids.length} users deleted successfully`, {
            icon: "success",
          });
          $.ajax({
            type: "post",
            url: "/api/deleteUsers",
            data: JSON.stringify({ ids: Ids }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
              $("#select-all").prop("checked", false);
              fetchUsers();
            },
          });
        }
      });
    });

    // fetch user function
    function fetchUsers() {
      // $(table).fadeOut();
      // $(table).fadeIn();
      // $(table).slideUp();
      // $(table).slideDown();
      $.ajax({
        type: "get",
        url: "/api/fetchUsers",
        dataType: "json",
        success: function (response) {
          const data = response.data;
          if (response.state.status) {
            populateData(data);
          } else {
            populateData(data);
            swal({
              title: "OOPS",
              text: response.state.msg,
              icon: "warning",
              button: "Ok",
            });
          }
        },
      }).then(() => {
        // add click event on delete button after fetch for users to delele specific user
        $(".delete").click(function () {
          let dataId = $(this).attr("data-id");
          let dataEmail = $(this).attr("data-email");
          swal({
            title: "Are you sure?",
            text: `Do you want to delete ${dataEmail}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              $.ajax({
                type: "delete",
                url: `/api/deleteUser/${dataId}`,
                dataType: "json",
                success: function (response) {
                  swal("User deleted Successfully", {
                    icon: "success",
                  }).then(() => {
                    fetchUsers();
                  });
                },
              });
            }
          });
        });

        // add click event on edit button after fetch for users to populate data into form
        $(".edit").click(function () {
          let dataEmail = $(this).attr("data-email");
          $.ajax({
            type: "get",
            url: `/api/fetchUser/${dataEmail}`,

            dataType: "json",
            success: function (response) {
              let userData = response.data[0];

              document.getElementById("e_first_name").value =
                userData.first_name;
              document.getElementById("e_last_name").value = userData.last_name;
              document.getElementById("newEmail").value = userData.email;
              document.getElementById("oldEmail").value = userData.email;
              document.getElementById("newPhone").value = userData.phone;
              document.getElementById("oldPhone").value = userData.phone;
              document.getElementById("e_password").value = userData.password;
              document.getElementById("e-id").value = userData.id;

              // For select fields, set the selected option based on userData
              document
                .getElementById("e_department")
                .querySelector(
                  `option[value="${userData.department}"]`
                ).selected = true;
              document
                .getElementById("e_admin_status")
                .querySelector(
                  `option[value="${userData.admin_status}"]`
                ).selected = true;
            },
          });
        });
      });
    }

    // populate data into table
    function populateData(data) {
      let tbody = $("#table-body");
      $(tbody).html("");
      data.forEach(function (user) {
        let tr = $("<tr>");

        $(tr).html(`
    <td>${user.first_name + " " + user.last_name}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${user.department}</td>
    <td style="color:${
      user.admin_status ? "blue" : "grey"
    }">${user.admin_status ? "Admin" : "User"}</td>
    <td>
        <div class="btn-group dropend">

            <span class="vertical-ellipsis" data-bs-toggle="dropdown"
                aria-expanded="false">&hellip;</span>

            <ul class="dropdown-menu  bg-transparent border" style="min-width:119px">
                <li><button type="button"
                        class="btn btn-outline-primary btn-sm ms-4 mb-2 w-50 edit"
                        data-id="${
                          user.id
                        }" data-email="${user.email}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></li>
                <li><button type="button" class="btn btn-outline-danger btn-sm ms-4 w-50 delete"
                        data-id="${
                          user.id
                        }" data-email="${user.email}">Delete</button></li>
            </ul>
        </div>
    </td>
    <td><input class="form-check-input" data-id="${
      user.id
    }" type="checkbox"></td>`);

        tbody.append(tr);
      });
    }

    // toogle eye for edit form
    $(".e_toggle-password").click(function () {
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
      "password is too weak"
    );

    //add method for valid Indain mobile number
    $.validator.addMethod(
      "mobileIndia",
      function (phone_number, element) {
        phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
        return (
          this.optional(element) ||
          (phone_number.length === 10 && phone_number.match(/^[6-9]\d{9}$/))
        );
      },
      "Please specify a valid mobile number."
    );

    //add method for valid email
    $.validator.addMethod(
      "emailCustom",
      function (email, element) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        email = $.trim(email);
        return this.optional(element) || emailPattern.test(email);
      },
      "Please enter a valid email address."
    );

    // validation for edit form
    $("#edit-form").validate({
      rules: {
        first_name: {
          required: true,
        },
        newEmail: {
          emailCustom: true,
          required: true,
        },
        password: {
          required: true,
          // strongPassword:true
        },
        newPhone: {
          required: true,
          mobileIndia: true,
        },
      },
      messages: {
        password: {
          required: "Please enter a password.",
        },
        email: {
          required: "Please enter a email.",
        },
      },
      submitHandler: function () {
        const form = document.getElementById("edit-form");
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        console.log(userData);
        editUser(userData).then((res) => {
          if (res.status) {
            swal({
              title: "Done!",
              text: res.msg,
              icon: "success",
              button: "OK",
            }).then(() => {
              $("#closemodal").click();
              fetchUsers();
            });
          } else {
            swal({
              title: "Warning",
              text: res.msg,
              icon: "warning",
              button: "Ok",
            });
          }
        });
      },
    });

    // function for edit user details
    async function editUser(data) {
      let res = "";
      await $.ajax({
        type: "put",
        url: `/api/update/${data.id}`,
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

    //add user modal validation  and submit handler
    $("#add-form").validate({
      rules: {
        first_name: {
          required: true,
        },
        email: {
          required: true,
          emailCustom: true,
        },
        password: {
          required: true,
          // strongPassword:true
        },
        phone: {
          required: true,
          mobileIndia: true,
        },
        admin_status: {
          required: true,
        },
        department: {
          required: true,
        },
      },
      messages: {
        password: {
          required: "Please enter a password.",
        },
        email: {
          required: "Please enter a email.",
        },
      },
      submitHandler: function () {
        const form = document.getElementById("add-form");
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        console.log(userData);
        $.ajax({
          type: "post",
          url: `/api/signup`,
          data: JSON.stringify(userData),
          contentType: "application/json",
          dataType: "json",
          success: function (response) {
            return response;
          },
          error: function (xhr, status, error) {
            console.table(xhr.responseJSON.errors);
            console.error(status); // Log status
            console.error(error); // Log error
          },
        }).then((res) => {
          if (res.status) {
            swal({
              title: "Done!",
              text: res.msg,
              icon: "success",
              button: "OK",
            }).then(() => {
              $("#closemodal2").click();
              fetchUsers();
            });
          } else {
            swal({
              title: "Warning",
              text: res.msg,
              icon: "warning",
              button: "Ok",
            });
          }
        });
      },
    });
  }
});
