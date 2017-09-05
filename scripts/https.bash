#/bin/bash

URL="##URL##"

openssl genrsa -out $URL.key 2048

openssl req -config /vagrant/scripts/https.conf -new -key $URL.key -out $URL.csr

openssl x509 -req -in $URL.csr -CA /vagrant/scripts/taupecat.pem -CAkey /vagrant/scripts/taupecat.key \
	-CAcreateserial -out $URL.crt -days 365 -sha256 -extfile /vagrant/scripts/https.conf
