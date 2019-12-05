var logger = require('../logger');
var invoke = require('../invoke')
var queryMeds = require('../query');
//var DailyRotateFile = require("winston-daily-rotate-file");
/**
 
 * For creating Medical Document
 */
let createMedicalDoc = async (data) => {

 console.log("data is:",data.name);
    try {
     const meddoc =  await invoke(data);
       // console.log("meddoc ", meddoc);
       return { result: meddoc };
    
    } catch (err) {
        
        return { result: err };
    }

};


/**
 * 
 * For querying Medical Document
 */
let medicalHistory = async(req) => {

   // logger.info(req);
  
 
    try {
        const medsHistory = await queryMeds(req, 'query');
        return { result:medsHistory };
    
    
    } catch (err) {
        
        return { result: err };
    }

};


/**
 * 
 * For querying Medical Document
 */
let allmedicalHistory = async(req) => {

    // logger.info(req);
   
  
     try {
         const allmedicalHistory = await queryMeds(req, 'queryAllMeds');
         return { result:allmedicalHistory };
     
     
     } catch (err) {
         
         return { result: err };
     }
 
 };

module.exports = {createMedicalDoc, medicalHistory, allmedicalHistory};