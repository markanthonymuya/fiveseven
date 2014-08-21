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

	$('#subheadTodayTrans').hide('slow');
	$('#subheadAllTrans').hide('slow');
	/////////////////////////Add New Account

	$('#addNewAccountLink').click(function(){
		if(getCookie("adminFullname") == undefined || getCookie("adminLinks") == undefined || getCookie("adminFullname") == "" || getCookie("adminLinks") == ""){
			// $("#adminLoginMsg").hide();
			// $("#adminLogin").modal('show');
		}
		else{
			$('#addNewAccountModal').modal('show');
		    $('#addNewButton').hide();
		    $('#createButton').show();
		    $('#addNewAccountModal').on('shown.bs.modal', function (e) {
				$('#createLoading').attr('src', '');
				$('#inputName').focus();
			});

			$("#createButton").click(function(){
				$('#createLoading').attr('src', 'images/loader.gif');
				$('#createButton').attr('disabled', 'disabled');

				var dataNewAccount = {accountName: $('#inputName').val(), emailAddress: $('#inputEmail').val(), contactNumber: $('#inputContact').val(), homeAddress: $('#inputAddress').val(), createdBy: getCookie("adminUsername")};
				$.post("php/newAccount.php", dataNewAccount, function(accountNumber,status){
					if(status = "success"){
						$('#createButton').removeAttr('disabled');
						$('#createLoading').attr('src', '');
						$('#createMessage').text("Your account number: " + accountNumber);
						$('#createMessage').attr('style', 'color:green;');
						$('#createButton').hide();
						$('#addNewButton').show();
						$('#addNewButton').focus();
					}
				});
		  	});
		}
		$('.sub-header').text("Accounts");
		$('#subheadAccounts').show('slow');
		$('#subheadTodayTrans').hide('slow');
		$('#subheadAllTrans').hide('slow');
	});
  	

  	$("#addNewButton").click(function(){
  		clearNewAccountInputs();
		$('#inputName').focus();
  		$('#createButton').show();
		$('#addNewButton').hide();
		$('#createMessage').text("");
  	});
  	
  	$('#addNewAccountModal').on('hidden.bs.modal', function (e) {
	  	$('#createLoading').attr('src', '');
	  	$('#createMessage').text("");
	  	clearNewAccountInputs();
	})

	/////////////////////////////////// New Contribution

	$('#newContributionLink').click(function(){
		if(getCookie("adminFullname") == undefined || getCookie("adminLinks") == undefined || getCookie("adminFullname") == "" || getCookie("adminLinks") == ""){
			// $("#adminLoginMsg").hide();
			// $("#adminLogin").modal('show');
		}
		else{
			$('#newContributionModal').modal('show');
		    $('#addNewContributionButton').hide();
		    $('#contributeButton').show();
		    $('#accountNameSearch').hide();
		    $('#addNewAccountModal').on('shown.bs.modal', function (e) {
				$('#contributeLoading').attr('src', '');
				$('#accountSearch').focus();
			})

			$("#contributeButton").click(function(){
				$('#contributeLoading').attr('src', 'images/loader.gif');
				$('#contributeButton').attr('disabled', 'disabled');

				var dataNewAccount = {transactBy: getCookie("adminUsername"),searchEngine: $('#accountSearch').val(), amountContributed: $('#inputAmount').val()};
				$.post("php/newContribution.php", dataNewAccount, function(json,status){
					if(json.status = "success"){
						$('#contributeButton').removeAttr('disabled');
						$('#contributeLoading').attr('src', '');
						$('#contributeMessage').text("You've successfully contributed: Php " + json.amountContributed);
						$('#contributeMessage').attr('style', 'color:green;');
						$('#contributeButton').hide();
						$('#addNewContributionButton').show();
						$('#addNewContributionButton').focus();
					}
				});
		  	});
		}
		$('.sub-header').text("Today's Transaction");
		$('#subheadAccounts').hide('slow');
		$('#subheadTodayTrans').show('slow');
		$('#subheadAllTrans').hide('slow');
	});

	var clearNewAccountInputs = function(){
		$('#inputName').val('');
  		$('#inputEmail').val('');
  		$('#inputContact').val('');
  		$('#inputAddress').val('');
	}


	/////////////////////////////////// Today's Income Link
	$('#todayIncomeLink').click(function(){
		$('.sub-header').text("Today's Transaction");
		$('#subheadAccounts').hide('slow');
		$('#subheadTodayTrans').show('slow');
		$('#subheadAllTrans').hide('slow');
	});


	/////////////////////////////////// Over-all Income Link
	$('#overallIncomeLink').click(function(){
		$('.sub-header').text("History");
		$('#subheadAccounts').hide('slow');
		$('#subheadTodayTrans').hide('slow');
		$('#subheadAllTrans').show('slow');
	});

});