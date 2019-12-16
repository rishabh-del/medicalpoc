/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'medical' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated medical chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'medical'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }


  async queryMeds(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting reportID ex: MED01');
    }
    let reportID = args[0];

    let medAsBytes = await stub.getState(reportID); //get the med from chaincode state
    if (!medAsBytes || medAsBytes.toString().length <= 0) {
      throw new Error(reportID + ' does not exist: ');
    }
    console.log(medAsBytes.toString());
    return medAsBytes;
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let meds = [];
    meds.push({
      name: "abc",
      age: "25",
      medicine: "para",
      file: "file1",
      gender: "Male"
    });
    meds.push({
      name: "abcs",
      age: "21",
      medicine: "param",
      file: "file2",
      gender: "Male"
    });


    for (let i = 0; i < meds.length; i++) {
      // meds[i].docType = 'med';
      await stub.putState('MED' + i, Buffer.from(JSON.stringify(meds[i])));
      console.info('Added <--> ', meds[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createMed(stub, args) {
    console.info('============= START : Create Med ===========', args);
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    var med = {
      name: args[1],
      age: args[2],
      medicine: args[3],
      file: args[4],
      gender: args[5]
    }

    // var med = {
    //   docType: 'med',
    //   make: args[1],
    //   owner: args[2]
    // };

    await stub.putState(args[0], Buffer.from(JSON.stringify(med)));
    console.info('============= END : Create Medical Document ===========');
  }

 // query callback representing the query of a chaincode
 async query(stub, args) {
  if (args.length != 1) {
    throw new Error('Incorrect number of arguments. Expecting name of the person to query')
  }

  let jsonResp = {};
  let A = args[0];

  // Get the state from the ledger
  let Avalbytes = await stub.getState(A);
  if (!Avalbytes) {
    jsonResp.error = 'Failed to get state for ' + A;
    throw new Error(JSON.stringify(jsonResp));
  }

  jsonResp.name = A;
  jsonResp.amount = Avalbytes.toString();
  console.info('Query Response:');
  console.info(jsonResp);
  return Avalbytes;
}

  async queryAllMeds(stub, args) {

  //  let startKey = 'MED0';
  //  let endKey = 'MED999';
let key = args[0];
    let iterator = await stub.getHistoryForKey(key);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeMedMake(stub, args) {
    console.info('============= START : changeMedMake ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let medAsBytes = await stub.getState(args[0]);
    let med = JSON.parse(medAsBytes);
    med.make = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(med)));
    console.info('============= END : changeMedMake ===========');
  }
};

shim.start(new Chaincode());
