#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# This script is designed to be run in the ${ORG_NAME}cli container as the
# second step of the EYFN tutorial. It joins the ${ORG_NAME} peers to the
# channel previously setup in the BYFN tutorial and install the
# chaincode as version 2.0 on peer0.${ORG_NAME}.
#

echo
echo "========= Getting ${ORG_NAME} on to your first network ========= "
echo
CHAINCODE_V="$8"
ORG_NUMBER="$7"
ORG_NAME="$6"
echo $ORG_NUMBER $ORG_NAME
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="node"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
: ${ORG_NAME:="org3"}
: ${ORG_NUMBER:="7"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5


CC_SRC_PATH="github.com/chaincode/medical/javascript/"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/medical/javascript/"
fi

# import utils
. scripts/utils.sh
echo $ORDERER_CA
echo "Fetching channel config block from orderer..."
set -x
peer channel fetch 0 $CHANNEL_NAME.block -o orderer.example.com:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA >&log.txt
res=$?
set +x
cat log.txt
verifyResult $res "Fetching config block from orderer has Failed"
echo $ORG_NUMBER ${ORG_NUMBER} $CHAINCODE_V
joinChannelWithRetry 0 $ORG_NUMBER
echo "===================== peer0.${ORG_NUMBER} joined channel '$CHANNEL_NAME' ===================== "
joinChannelWithRetry 1 $ORG_NUMBER
echo "===================== peer1.${ORG_NAME} joined channel '$CHANNEL_NAME' ===================== "
echo "Installing chaincode $CHAINCODE_V on peer0.${ORG_NAME}..."
installChaincode 0 $ORG_NUMBER $CHAINCODE_V

echo
echo "========= ${ORG_NAME} is now halfway onto your first network ========= "
echo

exit 0
