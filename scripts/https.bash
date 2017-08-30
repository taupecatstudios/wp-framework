#/bin/bash

PROJECT="##PROJECT##"

openssl genrsa -out $PROJECT.local.key 2048

openssl req -config /vagrant/scripts/https.conf -new -key $PROJECT.local.key -out $PROJECT.local.csr

openssl x509 -req -in $PROJECT.local.csr -CA /vagrant/scripts/$PROJECT.key -CAkey /vagrant/scripts/$PROJECT.key \
	-CAcreateserial -out $PROJECT.local.crt -days 365 -sha256 -extfile /vagrant/scripts/https.conf
