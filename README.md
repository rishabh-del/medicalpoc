# MedicalPOC

 

Health Care Blockchain
05.12.2019
─
Rishabh Pandey

Overview
A HealthCare based blockchain application implemented on HyperLedger Fabric with effective patient diagnosis monitoring and highly available information for all the stakeholders involved.
Goals
    1. Provide an End to End Patient Monitoring Blockchain System
    2. Encompass all the business for effective application of HealthCare needs.
    3. Building easy communication within all the organizations involved
Specifications
We created a blockchain base involving two demo organizations with two peer each for fault tolerance and effective use of the hyperledger fabric.
The application supports user onboarding. We have used an external no-sql database for onboarding which helps prevent any external access to the Blockchain ledger. 



Current Implementation
There are three potential end users of this application Doctors, Pharmacist and Manufacturers.

The Doctors can prescribe and upload report of the patient and can also download past reports of the patient.
The Pharmacist and Manufacturer can view the details of the patient and download current and past reports.
Milestones
    I. Release 1(POC)
We Successfully built a demo to showcase the capabilities of the system. 


Execution Steps

For Linux

go to first-network folder
do ./startFab.sh
do docker ps -a to check the containers
do docker logs -f containerid to check the logs of the containers

This will start the network, install the chaincode, instantiate the chaincode

Go to mediacl/backend/hfc-keystore and empty the folder
Go to medical/backend
Do node enrolladmin.js
do node registeruser.js
do node app.js

Run localhost:3000 on web browser
signup to account
login
check the data for MED0 Patient

For Windows 

use 'wsl ./startFab.sh'

rest all the commands will be same