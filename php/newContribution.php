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

	$presentSum = mysqli_query($con, "SELECT SUM(contribution) as contributionSum FROM fiveseventransaction") or die(mysqli_error());
	while($totalIncome = mysqli_fetch_array($presentSum)){
		$overallIncome = $totalIncome["contributionSum"];
		mysqli_query($con, "UPDATE fiveseventotal SET overallIncome=$overallIncome");	
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