  #!/bin/bash


  echo "docker data need :"
  

  export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem && export CHANNEL_NAME=mychannel
sleep 3
  echo $ORDERER_CA && echo $CHANNEL_NAME

    #apt-get -y update && apt-get -y install jq
sleep 3
peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
apt-get -y update && apt-get -y install jq
sleep 3

  configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json
  sleep 3
  jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"org4MSP" :.[1]}}}}}' config.json ./channel-artifacts/org4.json > modified_config.json
  sleep 3
  configtxlator proto_encode --input config.json --type common.Config --output config.pb
sleep 3
  configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
   sleep 3
  configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output org4_update.pb 
  sleep 3
  configtxlator proto_decode --input org4_update.pb --type common.ConfigUpdate | jq . > org4_update.json
 cat config_update.json
 sleep 3
 echo '{"payload":{"header":{"channel_header":{"channel_id":"mychannel", "type":2}},"data":{"config_update":'$(cat org4_update.json)'}}}' | jq . > org4_update_in_envelope.json
  sleep 3
  configtxlator proto_encode --input org4_update_in_envelope.json --type common.Envelope --output org4_update_in_envelope.pb
  sleep 3
  peer channel signconfigtx -f org4_update_in_envelope.pb
sleep 3
  # you can issue all of these commands at once

export CORE_PEER_LOCALMSPID="Org2MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp

export CORE_PEER_ADDRESS=peer0.org2.example.com:9051
sleep 3
peer channel update -f org4_update_in_envelope.pb -c $CHANNEL_NAME -o orderer.example.com:7050 --tls --cafile $ORDERER_CA
sleep 3
exit 0
