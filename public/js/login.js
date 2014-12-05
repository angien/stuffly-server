 function login() {
  if ($('#em')[0].value != "" && $('#pw')[0].value != "") {
    $.ajax({
        url: '/api/user/login',
        type: 'POST',
        headers: {'Content-Type':'application/json'},
        data: "{\"email\":\"" + $('#em')[0].value + "\",\"password\":\"" + $('#pw')[0].value + "\"}",
        success: function(result) {
          console.log(result._id);
          if (result._id == null) {
            $("#em_field").addClass("has-error has-feedback");
            $("#pw_field").addClass("has-error has-feedback");
            $("div.has-error").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span><span id='inputError2Status' class='sr-only'>(error)</span></div>")
            
          }
          else {
            document.cookie = "userid=" + result._id;
            location.reload();
          }

          
        }

      });
    }
else {
  if ($('#em')[0].value == "") $("#em_field").addClass("has-error has-feedback");
  if ($('#pw')[0].value == "") $("#pw_field").addClass("has-error has-feedback");
   $("div.has-error").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span><span id='inputError2Status' class='sr-only'>(error)</span></div>")
}

  



      /*$.getJSON( "/api/user", function (data) {
        var flag = false;
        data.forEach(function(entry) {
            //alert("Password" + entry.password);
            if(entry.email == $('#em')[0].value && entry.password == $('#pw')[0].value) {
              flag = true;
              document.cookie = "userid=" + entry._id;
              console.log(entry._id + " has been stored");
              return;
            } 
          });
        if (flag) 
          location.reload()
        else {
          $("#em_field").addClass("has-error has-feedback");
          $("#pw_field").addClass("has-error has-feedback");
           $("div.has-error").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span><span id='inputError2Status' class='sr-only'>(error)</span></div>")
        }
        

      });*/
}

function register() {
if ($('#em')[0].value != "" && $('#pw')[0].value != "") {
 $.ajax({
  url: '/api/user/',
  type: 'POST',
  headers: {'Content-Type':'application/json'},
  data: "{\"email\":\"" + $('#em')[0].value + "\",\"password\":\"" + $('#pw')[0].value + "\"}",
  success: function(result) {
   login();
 },
 error: function(XMLHttpRequest, textStatus, errorThrown) { 
  $("#em_field").addClass("has-error has-feedback");
  $("#pw_field").addClass("has-error has-feedback");
  $("div.has-error").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span><span id='inputError2Status' class='sr-only'>(error)</span></div>")
  alert("This email has already been registered.");
}



});
}
else {
  if ($('#em')[0].value == "") $("#em_field").addClass("has-error has-feedback");
  if ($('#pw')[0].value == "") $("#pw_field").addClass("has-error has-feedback");
   $("div.has-error").append("<span class='glyphicon glyphicon-remove form-control-feedback' aria-hidden='true'></span><span id='inputError2Status' class='sr-only'>(error)</span></div>")
}
 
}

function logout() {
  document.cookie = "userid=" + "";
  location.reload();

}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}
