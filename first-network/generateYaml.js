var fs = require('fs');


var generateConfigtx = (data) => {
    
    let file = `
    # Copyright IBM Corp. All Rights Reserved.
    #
    # SPDX-License-Identifier: Apache-2.0
    #
    
    
    ################################################################################
    #
    #   Section: Organizations
    #
    #   - This section defines the different organizational identities which will
    #   be referenced later in the configuration.
    #
    ################################################################################
    Organizations:
        - &${data}
            # DefaultOrg defines the organization which is used in the sampleconfig
            # of the fabric.git development environment
            Name: ${data}MSP
    
            # ID to load the MSP definition as
            ID: ${data}MSP

            MSPDir: crypto-config/peerOrganizations/${data}.example.com/msp

            # Policies defines the set of policies at this level of the config tree
            # For organization policies, their canonical path is usually
            #   /Channel/<Application|Orderer>/<OrgName>/<PolicyName>
            Policies:
                Readers:
                    Type: Signature
                    Rule: "OR('${data}MSP.admin', '${data}MSP.peer', '${data}MSP.client')"
                Writers:
                    Type: Signature
                    Rule: "OR('${data}MSP.admin', '${data}MSP.client')"
                Admins:
                    Type: Signature
                    Rule: "OR('${data}MSP.admin')"
    
            AnchorPeers:
                # AnchorPeers defines the location of peers which can be used
                # for cross org gossip communication.  Note, this value is only
                # encoded in the genesis block in the Application section context
                - Host: peer0.${data}.example.com
                  Port: 11051`;
    
                  fs.writeFile("configtx.yaml", file, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                }); 
    
    }



var generateCrypto = (data) => {
  
    let file = `
    # Copyright IBM Corp. All Rights Reserved.
    #
    # SPDX-License-Identifier: Apache-2.0
    #
    
    # ---------------------------------------------------------------------------
    # "PeerOrgs" - Definition of organizations managing peer nodes
    # ---------------------------------------------------------------------------
    PeerOrgs:
      # ---------------------------------------------------------------------------
      # ${data}
      # ---------------------------------------------------------------------------
      - Name: ${data}
        Domain: ${data}.example.com
        EnableNodeOUs: true
        Template:
          Count: 2
        Users:
          Count: 1`;
    
                  fs.writeFile(`${data}-crypto.yaml`, file, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                }); 
    
    }

var generateDockerCompose = (data) => {

    let file=`# Copyright IBM Corp. All Rights Reserved.
    #
    # SPDX-License-Identifier: Apache-2.0
    #
    
    version: '2'
    
    volumes:
      peer0.${data}.example.com:
      peer1.${data}.example.com:
    
    networks:
      byfn:
    
    services:
    
      peer0.${data}.example.com:
        container_name: peer0.${data}.example.com
        extends:
          file: base/peer-base.yaml
          service: peer-base
        environment:
          - CORE_PEER_ID=peer0.${data}.example.com
          - CORE_PEER_ADDRESS=peer0.${data}.example.com:11051
          - CORE_PEER_LISTENADDRESS=0.0.0.0:11051
          - CORE_PEER_CHAINCODEADDRESS=peer0.${data}.example.com:11052
          - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:11052
          - CORE_PEER_GOSSIP_BOOTSTRAP=peer1.${data}.example.com:12051
          - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.${data}.example.com:11051
          - CORE_PEER_LOCALMSPID=${data}MSP
        volumes:
            - /var/run/:/host/var/run/
            - ./${data}-artifacts/crypto-config/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/msp:/etc/hyperledger/fabric/msp
            - ./${data}-artifacts/crypto-config/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/tls:/etc/hyperledger/fabric/tls
            - peer0.${data}.example.com:/var/hyperledger/production
        ports:
          - 11051:11051
        networks:
          - byfn
    
      peer1.${data}.example.com:
        container_name: peer1.${data}.example.com
        extends:
          file: base/peer-base.yaml
          service: peer-base
        environment:
          - CORE_PEER_ID=peer1.${data}.example.com
          - CORE_PEER_ADDRESS=peer1.${data}.example.com:12051
          - CORE_PEER_LISTENADDRESS=0.0.0.0:12051
          - CORE_PEER_CHAINCODEADDRESS=peer1.${data}.example.com:12052
          - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:12052
          - CORE_PEER_GOSSIP_BOOTSTRAP=peer0.${data}.example.com:11051
          - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.${data}.example.com:12051
          - CORE_PEER_LOCALMSPID=${data}MSP
        volumes:
            - /var/run/:/host/var/run/
            - ./${data}-artifacts/crypto-config/peerOrganizations/${data}.example.com/peers/peer1.${data}.example.com/msp:/etc/hyperledger/fabric/msp
            - ./${data}-artifacts/crypto-config/peerOrganizations/${data}.example.com/peers/peer1.${data}.example.com/tls:/etc/hyperledger/fabric/tls
            - peer1.${data}.example.com:/var/hyperledger/production
        ports:
          - 12051:12051
        networks:
          - byfn
    
    
          
      ${data}cli:
        container_name: ${data}cli
        image: hyperledger/fabric-tools:$IMAGE_TAG
        tty: true
        stdin_open: true
        environment:
          - GOPATH=/opt/gopath
          - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
          #- FABRIC_LOGGING_SPEC=INFO
          - FABRIC_LOGGING_SPEC=DEBUG
          - CORE_PEER_ID=${data}cli
          - CORE_PEER_ADDRESS=peer0.${data}.example.com:11051
          - CORE_PEER_LOCALMSPID=${data}MSP
          - CORE_PEER_TLS_ENABLED=true
          - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/tls/server.crt
          - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/tls/server.key
          - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/tls/ca.crt
          - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/users/Admin@${data}.example.com/msp
        working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
        command: /bin/bash
        volumes:
            - /var/run/:/host/var/run/
            - ./../chaincode/:/opt/gopath/src/github.com/chaincode
            - ./${data}-artifacts/crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
            - ./crypto-config/peerOrganizations/org1.example.com:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com
            - ./crypto-config/peerOrganizations/org2.example.com:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com
            - ./scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
        depends_on:
          - peer0.${data}.example.com
          - peer1.${data}.example.com
        networks:
          - byfn
    `

    fs.writeFile(`docker-compose-${data}.yaml`, file, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
}

module.exports = {generateCrypto, generateConfigtx, generateDockerCompose}
    