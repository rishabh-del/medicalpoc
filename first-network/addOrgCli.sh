#!/bin/bash


export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem && export CHANNEL_NAME=mychannel
 export CORE_PEER_ADDRESS=peer0.org4.example.com:11051
 sleep 3
echo $ORDERER_CA && echo $CHANNEL_NAME

peer channel fetch 0 mychannel.block -o orderer.example.com:7050 -c $CHANNEL_NAME --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
sleep 3
peer channel join -b mychannel.block
sleep 3
export CORE_PEER_ADDRESS=peer1.org4.example.com:12051

sleep 3

peer channel join -b mychannel.block
sleep 3
exit 0