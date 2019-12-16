#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# This script is designed to be run in the cli container as the third
# step of the EYFN tutorial. It installs the chaincode as version 2.0
# on peer0.org1 and peer0.org2, and uprage the chaincode on the
# channel to version 2.0, thus completing the addition of ${ORG_NAME} to the
# network previously setup in the BYFN tutorial.
#

echo
echo "========= Finish adding ${ORG_NAME} to your first network ========= "
echo
ORG_NUMBER="$7"
ORG_NAME="$6"
CHANNEL_NAME="$1"
CHAINCODE_V="$8"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="node"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5
echo $ORG_NUMBER $ORG_NAME
CC_SRC_PATH="github.com/chaincode/medical/javascript/"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/medical/javascript/"
fi

# import utils
. scripts/utils.sh


#Start of for loop 
for a in 1 2 3 4 5 6 7 8 9 10 11 12
do
    # if a is equal to 5 break the loop 
    if [ "$a" == "$ORG_NUMBER" ] 
    then 
        break
    fi 
echo "===================== Installing chaincode $CHAINCODE_V on peer0.${ORG_NAME} ===================== "

	installChaincode 0 $a $CHAINCODE_V
    # Print the value 
    echo "Iteration no $a"
done 


echo "===================== Upgrading chaincode on peer0.org1 ===================== "
upgradeChaincode 0 1 $CHAINCODE_V

echo
echo "========= Finished adding ${ORG_NAME} to your first network! ========= "
echo

exit 0
