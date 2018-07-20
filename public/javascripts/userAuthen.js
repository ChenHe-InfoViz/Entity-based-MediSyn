var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

checkCookie()
var userVali = false, emailVali = false, passVali = false;

function signinDia(mess = ""){
  // $("#dialog-form").prop("title", "Sign in")
  var ele = d3.select("#dialog-form fieldset")
  var div;
  $("fieldset").empty();
  ele.append("label").attr({
    "for": "username"
  }).text("Username")
  ele.append("input").attr({
    "type": "text",
    "id": "username",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusin", function(){ d3.select("#message").text(""); })
  ele.append("label").attr({
    "for": "password"
  }).text("Password")
  ele.append("input").attr({
    "type": "password",
    "id": "password",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusin", function(){ d3.select("#message").text(""); })
  ele.append("label").text("Forgot username?").append("a").text(" Get username.").attr("class", "usernameLink").append("br")
  ele.append("label").text("Forgot password?").append("a").text(" Reset password.").attr("class", "passwordLink").append("br")
  ele.append("label").text("No account?").append("a").text(" Sign up.").attr("class", "signupLink").append("br")
  ele.append("label").attr("id", "message").text(mess).style({color: "green"})

  $(".usernameLink").on("click", getUsernameDia)
  $(".passwordLink").on("click", forgotPasswordDia)
  $(".signupLink").on("click", signupDia)

  var diaObj = {
    title: "Sign in",
    autoOpen: false,
    height: 340,
    width: 330,
    modal: true,
    dialogClass: "ui-dialog",
    buttons: {
      "Sign in": signinPro,
      Cancel: function() {
        authenDia()
        //$("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
}

function signupDia(){
  userVali = passVali = emailVali= false;

  // $("#dialog-form").prop("title", "Sign up")
  var fieldset = d3.select("#dialog-form fieldset")
  $("fieldset").empty();
  fieldset.append("label").text("By signing up, you agree with ").append("a").text("the consent form of participation.\n\n").attr({
    "href": "https://drive.google.com/file/d/1WsGSiAkgje90wWuD9bejg0mGDkTJhsxg/view?usp=sharing",
    "target": "_blank"
  })
  var div = fieldset.append("div").attr("class", "infoLabel")
  div.append("label").attr({
    "for": "username",
  }).text("Username")
  div.append("label").attr("id", "nameErrorLabel")
  fieldset.append("input").attr({
    type: "text",
    id: "username",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusout", function(){
    userVali = false;
    var nameVali = ["document", "dtcbio", "effect", "entitie", "log", "note", "user"]
    var d = $(this).val();
    if(d.trim() == "") d3.select("#nameErrorLabel").text( "  Please input a username.").style("color", "red")
    else if(!(/^[a-z]+$/i.test(d.trim()))) d3.select("#nameErrorLabel").text( "  Only letters are allowed in Username.").style("color", "red")
    else if(nameVali.indexOf(d.trim()) > -1) d3.select("#nameErrorLabel").text( "  Username already exists.").style("color", "red")
    else 
    $.ajax({
      type: "POST",
      url: "/user/usernamedup/?username=" + d,
      dataType: "json",
      success: function(response){
        if(response.a){ $("#nameErrorLabel").val("&#10004;").css({
            color: "green"
          })
          userVali = true;
        }
        else d3.select("#nameErrorLabel").text("  Username already exists.").style("color", "red")
      },
      error: function () {console.log("username dup error!")}
    })
  }).on("focusin", function(d){
    d3.select("#nameErrorLabel").text("");
  })


  div = fieldset.append("div").attr("class", "infoLabel")
  div.append("label").attr({
    "for": "email",
  }).text("Email")
  div.append("label").attr("id", "emailErrorLabel")
  fieldset.append("input").attr({
    type: "text",
    id: "email",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusout", function(){
    emailVali = false;
    var d = $(this).val();
    if(d.trim() == "") d3.select("#emailErrorLabel").text( "  Please input an email address.").style("color", "red")
    else if(!emailRegex.test(d.trim())) d3.select("#emailErrorLabel").text( "  Please input a right email address.").style("color", "red")
    else $.ajax({
      type: "POST",
      url: "/user/emaildup/?email=" + d,
      dataType: "json",
      success: function(response){
        if(response.a){ $("#emailErrorLabel").val("&#10004;").css({color: "green"})
          emailVali = true;
        }
        else d3.select("#emailErrorLabel").text("  Email already registered. Please sign in.").style("color", "red")
      },
      error: function () {console.log("email error!")}
    })
  }).on("focusin", function(d){
    d3.select("#emailErrorLabel").text("")
  })


  div = fieldset.append("div").attr("class", "infoLabel")
  div.append("label").attr({
    "for": "password",
  }).text("Password")
  div.append("label").attr("id", "passErrorLabel")
  fieldset.append("input").attr({
    type: "password",
    id: "password",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusout", function(){
    passVali = false;
    var d = $(this).val();
    if(d.trim() == "") d3.select("#passErrorLabel").text( "  Please input a password.").style("color", "red")
    else{ $("#passErrorLabel").val("&#10004;").css({
          color: "green"
        })
      passVali = true;
    }
  }).on("focusin", function(d){
    d3.select("#passErrorLabel").text("")
  });
  fieldset.append("label").text("Already have an account?").append("a").text(" Sign in.").attr("class", "signinLink")

  // $("fieldset").add("label").text("Forgot password?").add("a").text("Reset password.").addClass("passwordLink")
  // $("fieldset").add("label").text("No account?").add("a").text("Sign up.").addClass("signupLink")
  // $(".usernameLink").on("click", getUsernameDia)
  // $(".passwordLink").on("click", resetPasswordDia)
  $(".signinLink").on("click", function(){signinDia()})

  var diaObj = {
    title: "Sign up",
    autoOpen: false,
    height: 370,
    width: 420,
    modal: true,
    buttons: {
      "Sign up": signupPro,
      Cancel: function() {
        authenDia()
        //$("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
}
function signupPro(){
  if(!userVali || !emailVali || !passVali) return;
  var user = {username: $("#username").val(), email: $("#email").val(), password: $("#password").val()}
  $.ajax({
      type: "POST",
      url: "/user/signup",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify(user),
      success: function(response){
        signinDia("You signed up successfully, please sign in.");
      },
      error: function () {console.log("sign up error!")}
    })
}

function signinPro(){
  var user = {username: $("#username").val(), password: $("#password").val()}
  //console.log(user)
  $.ajax({
      type: "POST",
      url: "/user/login",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify(user),
      success: function(response){
        if(response.success){
          username = user.username;
          taskDia()
          document.cookie = "medisynSession="+response.session;
          gloDiv = "#main";
          getEntityList()
          d3.select("#usernameButton").text(username)
          $("#dialog-form").dialog("close")
        } 
        else{
          //console.log("error")
          d3.select("#message").text("Username or password incorrect.").style({color: "red"})
        }
      },
      error: function () {console.log("sign in error!")}
    })
}

function getUsernameDia(){
  var fieldset = d3.select("#dialog-form fieldset")
  $("fieldset").empty();
  fieldset.append("label").attr({
    "for": "email"
  }).text("Email")
  fieldset.append("input").attr({
    type: "text",
    id: "email",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusin", function(){
    d3.select("#message").text("")
  })
  fieldset.append("label").text("Know username?").append("a").text(" Sign in.").attr("class", "signinLink").append("br")
  fieldset.append("label").attr("id", "message").text("")
  $(".signinLink").on("click", function(){signinDia()})

  var diaObj = {
    title: "Get username",
    autoOpen: false,
    height: 260,
    width: 350,
    modal: true,
    buttons: {
      "Get username": getUsernamePro,
      Cancel: function() {
        authenDia()
        //$("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
}
function forgotPasswordDia(){
  var fieldset = d3.select("#dialog-form fieldset")
  $("fieldset").empty();
  fieldset.append("label").attr({
    "for": "email"
  }).text("Email")
  fieldset.append("input").attr({
    type: "text",
    id: "email",
    class: "text ui-widget-content ui-corner-all"
  }).on("focusin", function(){
    d3.select("#message").text("")
  })
  fieldset.append("label").text("Remember password?").append("a").text(" Sign in.").attr("class", "signinLink").append("br")
  fieldset.append("label").text("").attr("id", "message")
  $(".signinLink").on("click", signinDia)

  var diaObj = {
    title: "Forgot password",
    autoOpen: false,
    height: 260,
    width: 350,
    modal: true,
    buttons: {
      "Reset": forgotPasswordPro,
      Cancel: function() {
        authenDia()
        //$("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
}

function authenDia(){
  var fieldset = d3.select("#dialog-form fieldset")
  $("fieldset").empty();

  var diaObj = {
    title: "Authentication",
    autoOpen: false,
    height: 80,
    width: 180,
    modal: true,
    buttons: {
      "Sign in": function(){signinDia()},
      "Sign up": signupDia,
    }
    // close: function() {
    //   //form[ 0 ].reset();
    //   //allFields.removeClass( "ui-state-error" );
    // }
  }
  $("#dialog-form").dialog(diaObj)
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
}

function getUsernamePro(){
  var d = $("#email").val();
  if(d.trim() == "") d3.select("#message").text( "Please input an email address.").style("color", "red")
  else if(!emailRegex.test(d.trim())) d3.select("#message").text( "Please input a right email address.").style("color", "red")
  else
    $.ajax({
      type: "POST",
      url: "/user/getusername",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify({email: $("#email").val()}),
      success: function(response){
        if(response.success){
          d3.select("#message").text(response.message).style("color", "green")
        } 
        else{
          console.log("error")
          d3.select("#message").text(response.message).style({color: "red"})
        }
      },
      error: function () {console.log("get username error!")}
    })
}

function forgotPasswordPro(){
  var d = $("#email").val();
  if(d.trim() == "") d3.select("#message").text( "Please input an email address.").style("color", "red")
  else if(!emailRegex.test(d.trim())) d3.select("#message").text( "Please input a right email address.").style("color", "red")
  else
  $.ajax({
      type: "POST",
      url: "/user/forgot",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify({email: $("#email").val()}),
      success: function(response){
        //console.log(response)
        if(response.success){
          d3.select("#message").text(response.message).style("color", "green")
        } 
        else{
          console.log("error")
          d3.select("#message").text(response.message).style({color: "red"})
        }
      },
      error: function () {console.log("forgot password error!")}
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var session = getCookie("medisynSession");
    //console.log(session)
    if (session != "") {
        $.ajax({
          type: "POST",
          url: "/user/login",
          dataType: "json",
          contentType:'application/json',
          data: JSON.stringify({session: session}),
          success: function(response){
            //console.log(response)
            if(response.message == "login"){
              document.cookie = "medisynSession="+"\"\""
              signinDia()
            } 
            else{
              username = response.user;
              gloDiv = "#main"
              getEntityList()
              d3.select("#usernameButton").text(username)
            }
          },
          error: function () {console.log("sign in session error!")}
        })
    } else {
        signinDia()
    }
}

function signoutPro(){
  document.cookie = "medisynSession="+"\"\"";

  d3.select("#usernameButton").text("")
  $("#main").empty()
  $("#checkBoxes").empty()
  $("#legendSvg").empty()
  //for(var i = 0; i < visObj.selectedEntities.length; i++){
    //document.getElementById("input" + visObj.selectedEntities[i].entity).checked = false;
  //}
  visObj.colMuTu = []
  visObj.disTumors = []
  visObj.dataRow = []
  visObj.selectedEntities = []
  updateSelectedEntityView()

  $("#showNoteDiv").empty()
  $("#showNoteDiv").css("display", "none")
  noteFilterEntity = {}

  if(interactionHistory.length > 0) saveHistory()
  for(var i = 0; i < historyWindows.length; i++) 
      historyWindows[i].close()

  if(hisStruc.length > 0) saveHisLog()
  username = "";
  signinDia();
}

function taskDia(mess = ""){
  // $("#dialog-form").prop("title", "Sign in")
  $.ajax({
      type: "POST",
      url: "/user/gettask",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify({username: username}),
      success: function(response){
        // console.log("saved");
        disTaskDia(response.tasks.map(a => a.task))
      },
      error: function(){
        console.log("get tasks error");
      }
    })
}

function feedbackDia(mess = ""){
  // $("#dialog-form").prop("title", "Sign in")
  $.ajax({
      type: "POST",
      url: "/user/getfeedback",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify({username: username}),
      success: function(response){
        // console.log("saved");
        disFeedbackDia(response.comments.map(a => a.comment))
      },
      error: function(){
        console.log("get feedback error");
      }
    })
}

function disTaskDia(tasks){
  var ele = d3.select("#dialog-form fieldset")
  //var div;
  $("fieldset").empty();
  ele.append("label").attr("class", "taskLabel").text("Whenever you come up with a new exploration task, please input it here, and then start to explore with your new task in mind.");
  ele.append("label").attr("class", "taskLabel").text("Please involve at least one drug, mutation, or cancer name in each task description.");//"Please fill in at least 3 tasks of drug-target relations that you want to explore. Please involve at least one drug, mutation, or cancer name in each task description.")
  ele.append("label").attr("class", "taskLabel").text("Example tasks: explore the targets of (drug name); investigate potent drugs for (mutation name); investigate Acute myeloid leukemia.")
  //ele.append("label").attr("class", "taskLabel").text("It is preferable that you input the task every time before you start the exploration session. You can always open this dialog through the dropdown menu of your account at the topright corner.")
  
  var taskDiv = ele.append("div").attr("id", "taskDiv")
  var inputed = taskDiv.selectAll(".inputedText").data(tasks)
  var inputedEnter = inputed.enter().append("textarea").attr({
    class: "inputedText",
    readonly: "readonly"
  }).text(function(d) { return d})
  inputed.exit().remove()

  taskDiv.append("textarea").attr({
    // "type": "text",
    "id": "descrip0",
    class: "descrip",
    placeholder: "Write one task...",
    // class: "text ui-widget-content ui-corner-all"
  })
  var diaObj = {
    title: "Task input",
    autoOpen: false,
    height: 600,
    width: 500,
    modal: true,
    dialogClass: "ui-dialog",
    buttons: {
      "Submit": taskInputPro,
      Cancel: function() {
        // authenDia()
        $("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
  $("#descrip0").focus()
}

function disFeedbackDia(tasks){
  var ele = d3.select("#dialog-form fieldset")
  //var div;
  $("fieldset").empty();
  ele.append("label").attr("class", "taskLabel").text("Please leave your comments about MediSyn, like the features / data you want but missing in the current version.");
  
  var feedbackDiv = ele.append("div").attr("id", "feedbackDiv")
  var inputed = feedbackDiv.selectAll(".inputedText").data(tasks)
  var inputedEnter = inputed.enter().append("textarea").attr({
    class: "inputedText",
    readonly: "readonly"
  }).text(function(d) { return d})
  inputed.exit().remove()

  feedbackDiv.append("textarea").attr({
    // "type": "text",
    "id": "descrip0",
    class: "descrip",
    placeholder: "Write one comment...",
    // class: "text ui-widget-content ui-corner-all"
  })
  

  ele.append("text").style('cursor', "pointer")
  .style({"font-family": "FontAwesome",
        "font-size": 15,
        "text-anchor": "start",
      "alignment-baseline": "hanging"
  }).text("\uf067").on("click", function(){
    var count = $("#feedbackDiv .descrip").length;
    taskDiv.append("textarea").attr({
      "id": "descrip" + count,
      class: "descrip",
      placeholder: "Write one comment...",
    })
  })

  var diaObj = {
    title: "Comment input",
    autoOpen: false,
    height: 600,
    width: 500,
    modal: true,
    dialogClass: "ui-dialog",
    buttons: {
      "Submit": commentInputPro,
      Cancel: function() {
        // authenDia()
        $("#dialog-form").dialog( "close" );
      }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  $("#dialog-form").dialog(diaObj)              
  $(".ui-dialog-titlebar-close").hide()
  $("#dialog-form").dialog("open")
  $("#descrip0").focus()
}

function commentInputPro(){
  var count = $("#feedbackDiv .descrip").length;
  var comments = [];
  for(var i = 0; i < count; i++){
    var t = $("#descrip" + i).val().trim();
    if(t.length > 0) comments.push({comment: t, time: getFormatedTime()})
  }
//console.log(comments)
  if(comments.length > 0){
    saveTaskFeedback("comments", comments)
  }
}

function taskInputPro(){
  var count = $("#taskDiv .descrip").length;
  var tasks = [];
  for(var i = 0; i < count; i++){
    var t = $("#descrip" + i).val().trim();
    if(t.length > 0) tasks.push({task: t, time: getFormatedTime()})
  }
  if(tasks.length > 0){
    saveTaskFeedback("tasks", tasks)
  }
}

function saveTaskFeedback(type, data){
  var ob = {};
  ob.username = username;
  ob[type] = data;
  ob.type = type;
  $.ajax({
      type: "POST",
      url: "/user/savetask",
      dataType: "json",
      contentType:'application/json',
      data: JSON.stringify(ob),
      success: function(response){
        //console.log("saved");
        $("#dialog-form").dialog( "close" );
      },
      error: function(){
        console.log("save tasks error");
      }
    })
}
