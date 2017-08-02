#/bin/bash

SITENAME=wp-framework.local

openssl genrsa -out $SITENAME.key 2048

openssl req -config /vagrant/scripts/https.conf -new -key $SITENAME.key -out $SITENAME.csr

openssl x509 -req -in $SITENAME.csr -CA /vagrant/scripts/myCA.pem -CAkey /vagrant/scripts/myCA.key -CAcreateserial -out $SITENAME.crt -days 365 -sha256 -extfile /vagrant/scripts/https.conf
