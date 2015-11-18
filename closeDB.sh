pm2 kill
service mongod stop
sed -i.bak 's/#bindIp: 127.0.0.1/bindIp: 127.0.0.1/g' /etc/mongod.conf
service mongod start
pm2 start pm2.json