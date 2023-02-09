openssl genrsa > key.pem
openssl req -config openssl.conf -new -x509 -key key.pem -out server.pem -days 365
