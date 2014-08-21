<?php

require('../key/access.php');

$accountName = $_POST['accountName'];
$emailAddress = $_POST['emailAddress'];
$contactNumber = $_POST['contactNumber'];
$homeAddress = $_POST['homeAddress'];
$createdBy = $_POST['createdBy'];

date_default_timezone_set("Asia/Manila");
$dateCreated = date('Y/m/d');
$timeCreated = date('h:i:s A');

mysqli_query($con,"INSERT INTO fiveseven (accountName, emailAddress, homeAddress, contactNumber, totalContribution, dateCreated, timeCreated, createdBy) VALUES ('$accountName', '$emailAddress', '$homeAddress', '$contactNumber', 0.00, '$dateCreated', '$timeCreated', '$createdBy')");

$accountNumber = "";

$resultAccountSearch = mysqli_query($con,"SELECT id FROM fiveseven WHERE accountName='$accountName' AND emailAddress='$emailAddress'");

while($row = mysqli_fetch_array($resultAccountSearch)){
	$zeroes = "";
	
	if($row['id'] >= 1000 && $row['id'] < 10000){
		$zeroes = "0";
	}
	elseif($row['id'] >= 100 && $row['id'] < 1000){
		$zeroes = "00";
	}
	elseif($row['id'] >= 10 && $row['id'] < 100){
		$zeroes = "000";
	}
	elseif($row['id'] > 0 && $row['id'] < 10){
		$zeroes = "0000";
	}

	$accountNumber = date("Y").$zeroes.$row['id'];
}
$searchEngine = $accountNumber.' '.$accountName;

mysqli_query($con,"UPDATE fiveseven SET accountNumber='$accountNumber', searchEngine='$searchEngine' WHERE accountName='$accountName' AND emailAddress='$emailAddress'");

header("Content-type:application/json");
echo json_encode($accountNumber);

mysqli_close($con);

?>