<?php

require('../key/access.php');

$getValues = mysqli_query($con,"SELECT todayIncome, overallIncome, newContribution FROM fiveseventotal");
$presentTotals = array();

while($row = mysqli_fetch_array($getValues)){
	$presentTotals['todayIncome'] = $row['todayIncome'];
	$presentTotals['overallIncome'] = $row['overallIncome'];
	$presentTotals['newContribution'] = $row['newContribution'];
}

header("Content-type:application/json");
echo json_encode($presentTotals);

mysqli_close($con);

?>