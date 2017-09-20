#!/bin/bash

# Remove the previous old document root
# (if it exists)
if [ -d /var/www/wordpress-old ]; then
	rm -rf /var/www/wordpress-old
fi

# Move the legacy WordPress directory to "old" and
# move the new one to be the current document root
mv /var/www/wordpress /var/www/wordpress-old
mv /var/www/wordpress-new /var/www/wordpress

# Link files needed in the document root to the EFS versions
sudo -u www-data ln -s /var/www/efs/advanced-cache.php /var/www/wordpress/wp-content/advanced-cache.php
sudo -u www-data ln -s /var/www/efs/cache /var/www/wordpress/wp-content/cache
sudo -u www-data ln -s /var/www/efs/sunrise.php /var/www/wordpress/wp-content/sunrise.php
sudo -u www-data ln -s /var/www/efs/uploads /var/www/wordpress/wp-content/uploads
sudo -u www-data ln -s /var/www/efs/wp-cache-config.php /var/www/wordpress/wp-content/wp-cache-config.php
sudo -u www-data ln -s /var/www/efs/iwp /var/www/wordpress/iwp
