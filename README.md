# Firstfuture

1. Setup MySQL database. MySQL database must support JSON datatype, so the default with XAMPP won't work. If using XAMPP, upgrade to latest MariaDB version (try https://articlebin.michaelmilette.com/how-to-upgrade-mysql-to-mariadb-in-xampp-in-5-minutes-on-windows/ , but don't forget to edit config.inc.php file if you change the password which is located at C:\xampp\phpMyAdmin\config.inc.php by default)
2. Run <code>npm install</code> to install dependencies listed in package.json
3. Fill out .env.dist and rename to .env
4. Run npm start
