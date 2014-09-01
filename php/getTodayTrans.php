<?php
require('../key/access.php');

$transDate = date("Y/m/d");

$resultAccounts = mysqli_query($con,"SELECT transId, accountNumber, contribution FROM fiveseventransaction WHERE transDate='$transDate'");

$accountDetails = array();
$counter = 1;

while($row = mysqli_fetch_array($resultAccounts)){
	$accountDetails['accountNumber'.$counter] = $row['accountNumber'];
	$accountNumber = $row['accountNumber'];
	$resultTotalCon = mysqli_query($con,"SELECT accountName, totalContribution FROM fiveseven WHERE accountNumber='$accountNumber'");
	
	while($rowTotalCon = mysqli_fetch_array($resultTotalCon)){
		$accountDetails['accountName'.$counter] = $rowTotalCon['accountName'];
		$accountDetails['totalContribution'.$counter] = $rowTotalCon['totalContribution'];
	}
	
	$accountDetails['contribution'.$counter] = $row['contribution'];
	$accountDetails['receiptNumber'.$counter] = $row['transId'];
	
	$accountDetails['totalResults'] = $counter;
	$counter++;
}

header("Content-type:application/json");
echo json_encode($accountDetails);

mysqli_close($con);
?>