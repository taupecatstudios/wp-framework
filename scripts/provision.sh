#!/usr/bin/env bash

apt-get update >/dev/null 2>&1
apt-get dist-upgrade -y >/dev/null 2>&1

echo "Installing MariaDB"
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password password' >/dev/null 2>&1
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password password' >/dev/null 2>&1
sudo apt-get -y install mariadb-server >/dev/null 2>&1
mysql --user=root --password=password -e \
	"GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION; FLUSH PRIVILEGES;"

echo "Installing nginx"
apt-get install -y nginx >/dev/null 2>&1
rm /etc/nginx/sites-enabled/default >/dev/null 2>&1
ln -s /vagrant/scripts/nginx /etc/nginx/sites-enabled/default >/dev/null 2>&1
sed -i 's/www-data/ubuntu/' /etc/nginx/nginx.conf >/dev/null 2>&1
sed -i 's/www-data/ubuntu/' /etc/php/7.0/fpm/pool.d/www.conf >/dev/null 2>&1

echo "Installing php7"
apt-get install -y \
	php \
	php-cli \
	php-gd \
	php-curl \
	php-memcache \
	php-fpm \
	php-xml \
	php-imagick \
	php-mbstring \
	php-mysql \
	>/dev/null 2>&1

echo "Installing WP-CLI"
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar >/dev/null 2>&1
chmod +x wp-cli.phar >/dev/null 2>&1
mv wp-cli.phar /usr/bin/wp >/dev/null 2>&1

echo "Reloading nginx configuration"
service nginx reload >/dev/null 2>&1
