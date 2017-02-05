#!/bin/bash

# AUTHOR:      Benjamin Barbesange
# DATE:        05/02/2017
# DESCRIPTION: This script perform an update on the ec2 server to deploy the
#              new server

KEY_FILE=${ec2_private_key}
USERNAME=${ec2_username}
IP=${ec2_ip}

cd ~/.ssh

# Log on the instance
echo "ssh -T -i ${KEY_FILE} ${USERNAME}@${IP}"
ssh -i ${KEY_FILE} ${USERNAME}@${IP} <<'ENDSSH'
    echo "sudo su"
    sudo su

    echo "cd server"
    cd server

    echo "npm stop"
    npm stop

    echo "git pull"
    git pull

    echo "npm start &"
    npm start &>/dev/null &

    echo "exit sudo and ssh"
    exit
    exit
ENDSSH

