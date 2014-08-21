<?php
	require('../key/access.php');
	

	$email = $_POST['username'];
	$password = md5($_POST['password']);
	// $password = md5($password);

 	$resultAdmin = mysqli_query($con, "SELECT fullname FROM fivesevenadmin WHERE logname='$email' AND passkey='$password'");
	$adminSearch = mysqli_fetch_array($resultAdmin);

 	$selection = array();

 	if(mysqli_num_rows($resultAdmin) == 1){
 		$selection['adminLinks'] = '<li role="presentation"><a id="registerAdmin" tabindex="-1" role="menuitem">Register New Admin</a></li>';
 		$selection['fullname'] = $adminSearch['fullname'];
	    $selection['query'] = true;
	}
	else{
		$selection['query'] = false;
	}

    header("Content-type:application/json");
	echo json_encode($selection);

	mysqli_close($con);
?>