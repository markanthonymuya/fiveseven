$(document).ready(function(){
	setInterval(function () { updateMyBoard() }, 1000);

	var updateMyBoard = function(){
		$.get("php/getPresentValues.php", function(json){
			$("#textTodayIncome").text("P "+json.todayIncome);
			$("#textOverallIncome").text("P "+json.overallIncome);
			$("#textNewContribution").text("P "+json.newContribution);
		});
	}
});