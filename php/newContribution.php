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

if(mysqli_query($con,"INSERT INTO fiveseventransaction (accountNumber, contribution, transDate, transTime, transactBy) VALUES ('$accountNumber', '$amountContributed', '$dateTransaction', '$timeTransaction', '$transactBy')")){
	$returnValue['status'] = 'success';
	$returnValue['amountContributed'] = number_format((float)$amountContributed, 2, '.', '');
}
else{
	$returnValue['status'] = 'fail';
	$returnValue['amountContributed'] = 'failed';
}

header("Content-type:application/json");
echo json_encode($returnValue);

mysqli_close($con);

?>