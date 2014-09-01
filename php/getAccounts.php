<?php
require('../key/access.php');

$limitResults = $_POST['limitResults'];
$idNumMin = $_POST['idMin'];
$idNumMax = $_POST['idMax'];

$resultAccounts = mysqli_query($con,"SELECT * FROM fiveseven WHERE id BETWEEN $idNumMin AND $idNumMax LIMIT $limitResults");

$accountDetails = array();
$counter = 1;

while($row = mysqli_fetch_array($resultAccounts)){
	$accountDetails['accountNumber'.$counter] = $row['accountNumber'];
	$accountDetails['accountName'.$counter] = $row['accountName'];
	$accountDetails['emailAddress'.$counter] = $row['emailAddress'];
	$accountDetails['homeAddress'.$counter] = $row['homeAddress'];
	$accountDetails['contactNumber'.$counter] = $row['contactNumber'];
	$accountDetails['totalContribution'.$counter] = $row['totalContribution'];
	$accountDetails['totalResults'] = $counter;
	$counter++;
}

header("Content-type:application/json");
echo json_encode($accountDetails);

mysqli_close($con);
?>