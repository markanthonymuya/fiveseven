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
		showAccounts(10, 0, 10);
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
						$('#inputName').attr('disabled', 'disabled');
						$('#inputEmail').attr('disabled', 'disabled');
						$('#inputContact').attr('disabled', 'disabled');
						$('#inputAddress').attr('disabled', 'disabled');
						dataNewAccount = {};
						$('#addNewButton').focus();
						showAccounts(10, 0, 10);
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
	});

	
	/////////////////////////////////// New Contribution

	$('#newContributionLink').click(function(){
		
		$(function() {
	        $("#accountSearch").autocomplete({
	        	source: "php/autoComplete.php",
	        	appendTo : newContributionModal
	        });
	    });

		if(getCookie("adminFullname") == undefined || getCookie("adminLinks") == undefined || getCookie("adminFullname") == "" || getCookie("adminLinks") == ""){
			// $("#adminLoginMsg").hide();
			// $("#adminLogin").modal('show');
		}
		else{
			$('#newContributionModal').modal('show');
		    $('#addNewContributionButton').hide();
		    $('#contributeButton').show();
		    $('#newContributionModal').on('shown.bs.modal', function (e) {
				$('#contributeLoading').attr('src', '');
				$('#accountSearch').focus();
			})
		}
		$('.sub-header').text("Today's Transaction");
		$('#subheadAccounts').hide('slow');
		$('#subheadTodayTrans').show('slow');
		$('#subheadAllTrans').hide('slow');
	});

	$("#contributeButton").click(function(){
		$('#contributeLoading').attr('src', 'images/loader.gif');
		$('#contributeButton').attr('disabled', 'disabled');

		var dataNewContribution = {transactBy: getCookie("adminUsername"),searchEngine: $('#accountSearch').val(), amountContributed: $('#inputAmount').val()};
		$.post("php/newContribution.php", dataNewContribution, function(json,status){
			if(json.status = "success"){
				$('#contributeButton').removeAttr('disabled');
				$('#contributeLoading').attr('src', '');
				$('#contributeMessage').text("New contribution: Php " + json.amountContributed);
				$('#totalContributionMessage').text("Total Contribution: Php " + json.newTotalContribution);
				$('#contributeMessage').attr('style', 'color:green;');
				$('#contributeButton').hide();
				$('#addNewContributionButton').show();
				$('#accountSearch').attr('disabled', 'disabled');
				$('#inputAmount').attr('disabled', 'disabled');
				dataNewContribution = {};
				$('#addNewContributionButton').focus();
			}
		});
	});

	$("#addNewContributionButton").click(function(){
  		clearNewContributionInputs();
		$('#accountSearch').focus();
  		$('#contributeButton').show();
		$('#addNewContributionButton').hide();
		$('#contributeMessage').text("");
  	});
  	
  	$('#newContributionModal').on('hidden.bs.modal', function (e) {
	  	$('#contributeLoading').attr('src', '');
	  	$('#contributeMessage').text("");
	  	clearNewContributionInputs();
	});


	/////////////////////////////////// Show Account Results
	var accountResultsAppended = false;
	var showAccounts = function(limitResultsVal, idMinVal, idMaxVal){
		var queryRangeAndLimits = {limitResults: limitResultsVal, idMin: idMinVal, idMax: idMaxVal};
		if(accountResultsAppended){
			$(".accountTableResults").remove();
		}
		
		$.post("php/getAccounts.php", queryRangeAndLimits, function(json,status){
			for(var totalResults = 1; totalResults <= json.totalResults; totalResults++){
				$("#bodyOfAccountsTable").append('<tr class="accountTableResults"><td>'+json['accountNumber'+totalResults]+'</td><td>'+json['accountName'+totalResults]+'</td><td>'+json['contactNumber'+totalResults]+'</td><td>'+json['homeAddress'+totalResults]+'</td><td>'+json['emailAddress'+totalResults]+'</td><td>'+json['totalContribution'+totalResults]+'</td></tr>');
				accountResultsAppended = true;
			}
		});
	}


	var clearNewAccountInputs = function(){
		$('#inputName').val('');
  		$('#inputEmail').val('');
  		$('#inputContact').val('');
  		$('#inputAddress').val('');
  		$('#inputName').removeAttr('disabled');
  		$('#inputEmail').removeAttr('disabled');
  		$('#inputContact').removeAttr('disabled');
  		$('#inputAddress').removeAttr('disabled');
	}

	var clearNewContributionInputs = function(){
		$('#accountSearch').val('');
  		$('#inputAmount').val('');
  		$('#accountSearch').removeAttr('disabled');
  		$('#inputAmount').removeAttr('disabled');
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

	showAccounts(10, 0, 10);
});