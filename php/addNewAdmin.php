<?php

require('../key/access.php');

 $fullName = $_POST['adminFullName'];
 $userName = $_POST['adminUserName'];
 $password = md5($_POST['adminPassword']);
 $myAdminFullName = $_POST['myAdminFullName'];
 $myAdminPassword = md5($_POST['myAdminPassword']);
 
 date_default_timezone_set("Asia/Manila");
 $dateAdded = date("Y/m/d");
 $timeAdded = date("H:i:s");

 //checks admin creator credentials
 $resultAdminSearch = mysqli_query($con,"SELECT id FROM fivesevenadmin WHERE fullname='$myAdminFullName' AND passkey = '$myAdminPassword'");
 $admin = mysqli_fetch_array($resultAdminSearch);

if(mysqli_num_rows($resultAdminSearch) == 1){
	$resultUsernameSearch = mysqli_query($con,"SELECT logname FROM fivesevenadmin WHERE logname='$userName'");
 	$userNameChecker = mysqli_fetch_array($resultUsernameSearch);
	if(!$userNameChecker){
		mysqli_query($con, "INSERT INTO fivesevenadmin (fullname, logname, passkey, createdBy, dateAdded, timeAdded) VALUES ('$fullName', '$userName', '$password', '$myAdminFullName', '$dateAdded', '$timeAdded')");
		$resultMsg = "successful";
	}
	else{
		$resultMsg = "username existing";
	}
}
else{
	$resultMsg = "not valid admin password";
}

 header("Content-type:application/json");
 echo json_encode($resultMsg);

 mysqli_close($con);
?>