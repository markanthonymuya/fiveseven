<?php
	require('../key/access.php');
 
	$term=$_GET["term"];
 
	$query=mysqli_query($con, "SELECT searchEngine FROM fiveseven where searchEngine like '%".$term."%' order by accountName ");
	$json=array();

	$counter = 1;
 
    while($fivesevenAccount=mysqli_fetch_array($query)){
        $json[$counter] = $fivesevenAccount["searchEngine"];
        $counter++;
    }
 
	echo json_encode($json);
 
?>