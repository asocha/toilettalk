<!doctype html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>API Test</title>
</head>
<body>
	<script type="text/javascript">
	var obj = JSON.parse('<?php require_once("ToiletTalkAPIv1.php"); $api = new ToiletTalkAPI(); echo $api->helloWorld();?>');
</script>
</body>
</html>