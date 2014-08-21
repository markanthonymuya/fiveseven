$(document).ready(function(){
	function setCookie(c_name,value,exdays)
	{
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}

	function getCookie(c_name)
	{
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++){
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  	y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
		  	if (x==c_name){
		    	return unescape(y);
		    }
		}
	}

	function unsetCookies(){
		setCookie("adminFullname", "",3);
		setCookie("adminLinks","",3);		
		setCookie("adminUsername","",3);
	}
	$("#adminLoginLink").click(function(){
		$("#adminLogin").modal('show');
	});
	

	if(getCookie("adminFullname") == undefined || getCookie("adminLinks") == undefined ||  getCookie("adminUsername") == undefined || getCookie("adminUsername") == "" || getCookie("adminFullname") == "" || getCookie("adminLinks") == ""){
		var login = false;
		$("#adminLoginMsg").hide();
		// $("#adminLogin").modal('show');
		
		$('#adminLogin').on('shown.bs.modal', function () {
			$("#adminUsername").focus();
		});

		// $('#adminLogin').on('hidden.bs.modal', function () {
		// 	if(login == false){
		// 		// location.href="/fiveseven";
		// 	}
		// 	console.log(getCookie("adminFullname"));
		// });

		$("#adminUserLogin").click(function(){
			var adminUsername = $("#adminUsername").val();
			var adminPassword = $("#adminPassword").val();
			$("#adminLoginMsg").hide();


			if(adminUsername != "" && adminPassword != ""){
				$.post("php/admin.php", {username: adminUsername, password: adminPassword}, function(json){
					if(json.query){
						$("#adminLoginLink").hide();
						$(".myUsername").text(json.fullname);
						$("#adminLogin").modal('hide');
						setCookie("adminFullname",json.fullname,3);
						setCookie("adminLinks",json.adminLinks,3);
						setCookie("adminUsername",adminUsername,3);
						$("#adminDropDown").prepend(json.adminLinks);
						
						$("#registerAdmin").click(function(){
							$("#addNewAdmin").modal('show');
						});
						login = true;
					}
					else{
						$("#adminLoginMsg").text("Your username and password is not found in the list of Admins.");
						$("#adminLoginMsg").show();
						$("#adminUsername").focus("");
						login = false;
					}
				});
			}
			else{
				$("#adminLoginMsg").show();
				$("#adminLoginMsg").text("Please do not leave any fields blank.");
			}
		});
	}
	else{
		$("#adminDropDown").prepend(getCookie("adminLinks"));
		$(".myUsername").text(getCookie("adminFullname"));
		$(".myUsername").append('<b class="caret">');
		
		$("#registerAdmin").click(function(){
			$("#addNewAdmin").modal('show');
		});

		$("#adminLoginLink").hide();
	}

	
	/////////////////////////////////Submitting New Amdmin User////////////////////////
	$("#registrationAdminMsg").hide();
	$("#signInBtn").hide();
	var registrationType;

	$("#registerNewAdmin").click(function(){
		var fullName = $("#newAdminFullName").val();
		var userName = $("#newAdminUserName").val();
		var password = $("#newAdminPassword").val();
		var retypePassword = $("#newAdminPasswordRetype").val();
		var confirmAdminPassword = $("#confirmAdminPasswordNewAdmin").val();

		if(fullName != "" && userName != "" && password != "" && retypePassword != "" && confirmAdminPassword != ""){
			$("#registrationAdminMsg").hide();
			$("#registerNewAdmin").attr("disabled", true);

			if(password != retypePassword){
				$("#registrationAdminMsg").text("Your desired password does not match the retype.");
				$("#registrationAdminMsg").show();
				$("#registerNewAdmin").attr("disabled", false);					
			}
			else{
				var data = {adminFullName: fullName, adminUserName: userName, adminPassword: password, myAdminFullName: getCookie("adminFullname"), myAdminPassword: confirmAdminPassword};
				
				$.post("php/addNewAdmin.php", data, function (response) {
					if(response == "successful"){
						alert("You've successfully registered new privilege user.");
						$("#addNewAdmin").modal('hide');
						clearAdminInput();
					}
					else if(response == "username existing"){
						$("#registrationAdminMsg").text("Username already in use.");
						$("#registrationAdminMsg").show();
						$("#unitCode").focus();
					}
					else if(response == "not valid admin password"){
						$("#confirmAdminPasswordNewAdmin").val("");
						$("#confirmAdminPasswordNewAdmin").focus();
						$("#registrationAdminMsg").text("Your current user password does not match our database.");
						$("#registrationAdminMsg").show();
						$("#unitNumber").focus();
					}
					$("#registerNewAdmin").attr("disabled", false);
			    });
			}
		}
		else{
			$("#registrationAdminMsg").text("Please do not leave empty input boxes.");
			$("#registrationAdminMsg").show();
		}
	});
	

	var clearAdminInput = function(){
		$("#newAdminFullName").val("");
		$("#newAdminUserName").val("");
		$("#newAdminPassword").val("");
		$("#newAdminPasswordRetype").val("");
		$("#confirmAdminPasswordNewAdmin").val("");
	}

	$("#signOut").click(function(){
		setCookie("adminFullname","",3);
		setCookie("adminLinks", "", 3);
		setCookie("adminUsername","",3);
	});

});