var fs = require('fs');



var generateInstallOrgScript = (data, chaincodeVersion) => {

  let file = `
    echo "Installing smart contract on peer0.${data}.example.com"
    docker exec \
      -e CORE_PEER_LOCALMSPID=${data}MSP \
      -e CORE_PEER_ADDRESS=peer0.${data}.example.com:${port1} \
      -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/users/Admin@${data}.example.com/msp \
      -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${data}.example.com/peers/peer0.${data}.example.com/tls/ca.crt \
      -e CORE_LEDGER_HISTORY_ENABLEHISTORYDATABASE=true \
      ${data}cli \
      peer chaincode install \
        -n medical \
        -v ${chaincodeVersion} \
        -p "/opt/gopath/src/github.com/chaincode/medical/javascript" \
        -l "node"`;

  fs.writeFile(`${data}-install.sh`, file, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

}


    module.exports = {generateInstallOrgScript}
