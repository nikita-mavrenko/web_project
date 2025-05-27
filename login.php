<?php
header('Content-Type: text/html; charset=UTF-8');
session_start();
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: login.php');
    exit();
}
if (!empty($_SESSION['login'])) {
    header('Location: ./');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require('database.php');
    $login = $_POST['login'];
    $password = md5($_POST['password']);
    try {
        $stmt = $db->prepare("SELECT id FROM proj_users WHERE login = ? and password = ?");
        $stmt->execute([$login, $password]);
        $its = $stmt->rowCount();
        if ($its) {
            $uid = $stmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];
            $_SESSION['login'] = $_POST['login'];
            $_SESSION['user_id'] = $uid;
            header('Location: ./');
        } else
            $error = 'Неверный логин или пароль';
    } catch (PDOException $e) {
        print ('Error : ' . $e->getMessage());
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <title>login</title>
</head>

<body>
    <form action="" method="post" class="form login-form">
        <div class="mess" style="color: black; display: block;"><?php echo $error; ?></div>
        <h2>Вход в форму</h2>
        <input class="input-login input" type="text" name="login" placeholder="Логин" required>
        <input class="input-login input" type="password" name="password" placeholder="Пароль" required>
        <button class="form__button" type="submit">Войти</button>
    </form>
</body>

</html>