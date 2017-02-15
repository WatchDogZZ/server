#!/bin/bash

# AUTHOR:      Benjamin Barbesange
# DATE:        05/02/2017
# DESCRIPTION: This script is used to pass parameters to the second script


# Your ~/.ssh must contain the filename provided here
export ec2_private_key="id_rsa"
export ec2_username="ubuntu"
export ec2_ip="192.168.1.16"

. deploy-ec2.sh

