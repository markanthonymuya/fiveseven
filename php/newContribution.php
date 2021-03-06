<?php

require('../key/access.php');

$transactBy = $_POST['transactBy'];
$searchEngine = $_POST['searchEngine'];
$amountContributed = $_POST['amountContributed'];

date_default_timezone_set("Asia/Manila");
$dateTransaction = date('Y/m/d');
$timeTransaction = date('h:i:s A');

$resultAccountNumberSearch = mysqli_query($con,"SELECT accountNumber FROM fiveseven WHERE searchEngine='$searchEngine'");
$accountNumber = "";

while($row = mysqli_fetch_array($resultAccountNumberSearch)){
	$accountNumber = $row['accountNumber'];
}

$returnValue = array();

$insertTrans = mysqli_query($con,"INSERT INTO fiveseventransaction (accountNumber, contribution, transDate, transTime, transactBy) VALUES ('$accountNumber', '$amountContributed', '$dateTransaction', '$timeTransaction', '$transactBy')");

if($insertTrans){
	$returnValue['status'] = 'success';
	$returnValue['amountContributed'] = number_format((float)$amountContributed, 2, '.', '');

	$query = mysqli_query($con, "SELECT dateViewed FROM fiveseventotal WHERE dateViewed='$dateTransaction'");
	$fetch_rows = mysqli_num_rows($query);

	$overallIncome = '0.0';
	$overallSum = mysqli_query($con, "SELECT SUM(contribution) as contributionSum FROM fiveseventransaction") or die(mysqli_error());
	while($totalIncome = mysqli_fetch_array($overallSum)){
		$overallIncome = $totalIncome["contributionSum"];	
	}

	$todayIncome = '0.0';
	$todaySum = mysqli_query($con, "SELECT SUM(contribution) as contributionTodaySum FROM fiveseventransaction WHERE transDate='$dateTransaction'") or die(mysqli_error());
	while($totalTodayIncome = mysqli_fetch_array($todaySum)){
		$todayIncome = $totalTodayIncome["contributionTodaySum"];	
	}

	if ($fetch_rows == 0){
		$insertTrans = mysqli_query($con,"INSERT INTO fiveseventotal (todayincome, overallIncome, newContribution, dateViewed) VALUES ('0.00', '$overallIncome', '0.00', '$dateTransaction')");
	}
	
	mysqli_query($con, "UPDATE fiveseventotal SET todayIncome=$todayIncome, overallIncome=$overallIncome, newContribution=$amountContributed WHERE dateViewed='$dateTransaction'");

	$totalContribution = mysqli_query($con, "SELECT totalContribution FROM fiveseven") or die(mysqli_error());
	while($totalCon = mysqli_fetch_array($totalContribution)){
		$presentTotalCon = $totalCon["totalContribution"];
		$newTotalContribution = number_format((float)$presentTotalCon, 2, '.', '') + $returnValue['amountContributed'];
		$returnValue['newTotalContribution'] = number_format((float)$newTotalContribution, 2, '.', '');
		mysqli_query($con, "UPDATE fiveseven SET totalContribution='$newTotalContribution' WHERE searchEngine='$searchEngine'");
	}	
}
else{
	$returnValue['status'] = 'fail';
	$returnValue['amountContributed'] = 'failed';
}

header("Content-type:application/json");
echo json_encode($returnValue);

mysqli_close($con);

?>