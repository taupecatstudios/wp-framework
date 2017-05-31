#/bin/bash

openssl req -config /vagrant/scripts/https.conf -new -sha256 -newkey rsa:2048 \
-nodes -keyout wp-framework.local.key -x509 -days 365 \
-out wp-framework.local.crt
