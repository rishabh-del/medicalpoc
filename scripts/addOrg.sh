# steps to add org 

# 1. generateCerts
# 2. generateChannelArtifacts
# 3. Fetch the config for the channel
# 4. Modify the configuration to append the new org
# 5. Compute a config update
# 6. Set the peerOrg admin of an org and signing the config update
# 7. peer channel update
# 8. start ${1} services (docker containers)
# 9. Fetch channel config block from orderer
# 10.Join channel all the peers individually
# 11.Install new chaincode version on all the orgs
# 12.Upgrade chaincode

echo "inside"
echo $1

# prepending $PWD/../bin to PATH to ensure we are picking up the correct binaries
# this may be commented out to resolve installed version of tools if desired
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false
export orgName=${1}
export chaincodeVersion=6


#mkdir ${1}-artifacts
#Generating certs
  # generate artifacts if they don't exist
  if [ ! -d "${1}-artifacts/crypto-config" ]; then
     which cryptogen
  if [ "$?" -ne 0 ]; then
    echo "cryptogen tool not found. exiting"
    exit 1
  fi
  echo
  echo "###############################################################"
  echo "##### Generate ${1} certificates using cryptogen tool #########"
  echo "###############################################################"

  (cd ${1}-artifacts
   set -x
   cryptogen generate --config=./${1}-crypto.yaml 
   res=$?
   set +x
   if [ $res -ne 0 ]; then
     echo "Failed to generate certificates..."
     exit 1
   fi
  )
  echo
   
   
   # generateChannelArtifacts
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi
  echo "##########################################################"
  echo "#########  Generating ${1} config material ###############"
  echo "##########################################################"
  cd ${1}-artifacts
   export FABRIC_CFG_PATH=$PWD
   set -x
   configtxgen -printOrg ${1}MSP > ../channel-artifacts/${1}.json
   res=$?
   set +x
   if [ $res -ne 0 ]; then
     echo "Failed to generate ${1} config material..."
     exit 1
   fi
  
  cd ../ && cp -r crypto-config/ordererOrganizations ${1}-artifacts/crypto-config/
  echo
  #manual setup try
 
  exit 0

   # createConfigTx
  fi

  exit 0
  
