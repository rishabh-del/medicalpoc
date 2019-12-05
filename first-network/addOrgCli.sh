#!/bin/bash

export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem && export CHANNEL_NAME=mychannel
export CORE_PEER_ADDRESS=peer1.org4.example.com:12051
 
echo $ORDERER_CA && echo $CHANNEL_NAME

peer channel fetch 6 mychannel.block -o orderer.example.com:7050 -c $CHANNEL_NAME

peer channel join -b mychannel.block

export CORE_PEER_ADDRESS=peer0.org4.example.com:11051


peer channel join -b mychannel.block

exit 0