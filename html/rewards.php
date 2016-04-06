<?php
$table = "rewards";
$post_count = 5;
include("lib/layout.php");
include("lib/ironserver.php");
authentication();
?>

<?php
if(isset($_POST["action"])){
    $dbh = new sqlite3('../main.db');
    if($_POST["action"] == "new"){
        $prepare = $dbh->prepare('INSERT INTO rewards(username, title, note, cost, image, link, owner) VALUES(:username, :title, :note, :cost, :image, :link, :owner)');
        $prepare->bindParam(':username', $_SESSION["username"]);
        $prepare->bindParam(':owner', $_POST["owner"]);
    }
    if($_POST["action"] == "edit"){
        $prepare = $dbh->prepare('UPDATE rewards SET title= :title, note= :note, cost= :cost, image= :image, link= :link WHERE id = :id');
        $prepare->bindParam(':id', $_POST["id"]);
    }
    if($_POST["action"] == "new" || $_POST["action"] == "edit"){
        $title= prepare_db_string($_POST["title"]);
        $prepare->bindParam(':title', $title);
        $note= prepare_db_string($_POST["note"]);
        $prepare->bindParam(':note', $note);
        $cost= prepare_db_string($_POST["cost"]);
        $prepare->bindParam(':cost', $cost);
        $image=prepare_db_string($_POST["image"]);
        $filename= download_file($image, 'img/rewards/');
        $prepare->bindParam(':image', $filename);
        $link= prepare_db_string($_POST["link"]);
        $prepare->bindParam(':link', $link);
        $result = $prepare->execute();
        if(!$result){
            echo $dbh->lastErrorMsg();
            exit();
        }
    }
    if($_POST["action"] == "award"){
        $prepare = $dbh->prepare('UPDATE rewards SET award_date = :date_now WHERE id = :id');
        $prepare->bindParam(':date_now', strftime('%s'));
        $prepare->bindParam(':id', $_POST["id"]);
    }
    $dbh->close();
    header("location:rewards.php");
}
?>

<html>
<?php
doctype();
head();
?>
<body>
<div class='container'>
<?php
html_header($table);
navigation();
?>
<div class="navigation">
<?php
if($_SESSION["user_id"]==1){
    page_navigation($table, $post_count , 'all');
} else {
    page_navigation($table, $post_count , $_SESSION["username"]);
}
?>
</div>
<div class="main">
<div class="content">
<?php
#get userlist string
foreach(list_users() as $s){
    if(!isset($users_str)){
        $users_str = '\''.$s.'\'';
    } else {
        $users_str = $users_str.','.'\''.$s.'\'';
    }
}
echo "<p  id='newform'><button class='database' onclick=\"javascript:newReward($users_str)\">
new
</button>\n</p>";
$dbh = new sqlite3('../main.db');
if(isset($_GET["offset"])){
	$offset = $_GET["offset"];
} else {
	$offset = 0;
}
$prepare = $dbh->prepare("SELECT * FROM rewards ORDER BY id DESC LIMIT :limit OFFSET :offset");
$prepare->bindParam(':limit', $post_count);
$prepare->bindParam(':offset', $offset);
$result = $prepare->execute();
while($row = $result->fetchArray(SQLITE3_ASSOC)){
	echo "<div class='post' id='post_" . $row["id"] . "'>";
    if($_SESSION["username"] == $row["owner"] || $_SESSION["user_id"] == 1){
        echo "<div class='controls'>";
        if(!$row["award_date"] && $_SESSION["user_id"] == 1){
            echo "<button class='database' onclick=\"javascript:awardReward('".$row["id"]."')\">
            award
            </button>";
        }
        echo "<button class='database' onclick=\"javascript:editReward(".$row["id"].")\">
        edit
        </button>
        <button class='database' onclick=\"javascript:archive('rewards', '".$row["id"]."')\">
        archive
        </button></div>";
    }
    echo "<h1 id='title_" . $row["id"] . "'>" . $row["title"] . "</h1>
    <h5 id='cost_" . $row["id"] . "'>" . $row["cost"]  . "</h5>";
	if($row["award_date"]){
		echo "awarded";
	} else {
		echo "not_awarded";
	}
	echo "<div class='descr'>" . $row["owner"] . ", " . gmdate('Y-m-d', $row['date']) . "</div>
    <div class='clearer'><span></span></div>
    <img id='image_". $row["id"] ."' class='reward' src=" . $row["image"] . ">
    <p><a id='link_".$row["id"]."' class='database' target= '_blank' href ='" . $row["link"] . "'>buy</a></p>
    <p id='note_" . $row["id"] . "'>" . $row["note"] . "</p>
    <div class='clearer'><span></span></div>
    </div>";
}
$dbh->close();
?>
</div>
<?php
sidenav();
?>
<div class="clearer"><span></span></div>
</div>
<div class="navigation">
<?php
if($_SESSION["user_id"]==1){
    page_navigation($table, $post_count , 'all');
} else {
    page_navigation($table, $post_count , $_SESSION["username"]);
}
?>
</div>
<?php footer(); ?>
</div>
</body>
</html>
