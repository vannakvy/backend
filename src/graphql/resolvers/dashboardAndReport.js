import moment from "moment";
export default {
  Query: {

    // @Desc all tested 
    // Access auth 

    getAllAllSampleTest:async(_,{},{PersonalInfo})=>{
    // let data =  await PersonalInfo.aggregate([
    //       {
    //         $project: {
    //             firstName: 1,
    //             arraySize: { $cond: { if: { $isArray: "$sampleTest" }, then: { $size: "$sampleTest" }, else: 0} },
    //             // arraySize: { $cond: [ $and: [{ if: { $isArray: "$sampleTest" }, then: { $size: "$sampleTest" }, else: 0}]]  }  
    //         }
    //       }
    //   ] )

      // $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
      // { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
  
      let today = new Date();
      today.setHours(0, 0, 0, 0);

    let data =  await PersonalInfo.aggregate([
        { "$match":{ "sampleTest.date": {$gte:today} } },
        { "$project": {
              "all": { "$size": "$sampleTest" }
        } },
        { "$group": {
            "_id": 1,
            "count": {
                "$sum": "$all"
            }
        } }
     ])


     let dataAll =  await PersonalInfo.aggregate([
      // { "$match":{ "sampleTest.date": {$gte:today} } },
      { "$project": {
            "all": { "$size": "$sampleTest" }
      } },
      { "$group": {
          "_id": 1,
          "count": {
              "$sum": "$all"
          }
      } }
   ])


      let to = data.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue.count;
      }, 0);
      let al = dataAll.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue.count;
      }, 0);
      return {
        today: to,
        all:al
      }
    },
      
    //@Desc getAllProvinces
    //@Access auth

    getAllProvince: async (
      _,
      { district },
      { PersonalInfo, Quarantine, Hospitalization, AffectedLocation,HospitalInfo,QuarantineInfo}
    ) => {

      console.log(district)
      let confirm = 0;
      let recover = 0;
      let death = 0;
      let confirmToday = 0;
      let recoveredToday = 0;
      let deathToday = 0;
      let quarantineToday=0;

      let today = new Date();
      today.setHours(0, 0, 0, 0); // set to 0:00
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
   

      let totalHospital = await HospitalInfo.countDocuments({})
      let totalQuarantine = await QuarantineInfo.countDocuments({})
      let totalAffectedLocation = await AffectedLocation.countDocuments({})
      let totalAffectedLocationClose = await AffectedLocation.countDocuments({
        $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} }],
      });
      let totalAffectedLocationOn = await AffectedLocation.countDocuments({
        $and: [{ openAt: {$ne: null} }, { closeAt: {$ne: null} }],
      });
      if (district === "" || district === "ករំីណីទាំងអស់") {
        confirm = await PersonalInfo.countDocuments({
          "currentState.confirm": true,
        });
        recover = await PersonalInfo.countDocuments({
          "currentState.recovered": true,
        });
        death = await PersonalInfo.countDocuments({
          "currentState.death": true,
        });
        // const confirmToday = await PersonalInfo.countDocuments({"currentState.confirm":true,"currentState.confirmedAt": new Date() });
     
        confirmToday = await PersonalInfo.countDocuments({
          "currentState.confirmedAt": { $gte: today, $lt: tomorrow },
        });
        recoveredToday = await PersonalInfo.countDocuments({
          "currentState.recoveredAt": { $gte: today, $lt: tomorrow },
        });
        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });

        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });

      } else {
        confirm = await PersonalInfo.countDocuments({
          $and: [{ "currentState.confirm": true }, { district: district }],
        });
        recover = await PersonalInfo.countDocuments({
          $and: [{ "currentState.recovered": true }, { district: district }],
        });
        death = await PersonalInfo.countDocuments({
          $and: [{ "currentState.death": true }, { district: district }],
        });
        //   // const confirmToday = await PersonalInfo.countDocuments({"currentState.confirm":true,"currentState.confirmedAt": new Date() });
        let today = new Date();
        today.setHours(0, 0, 0, 0); // set to 0:00
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        confirmToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        recoveredToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.recoveredAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });
        deathToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.deathAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        // quarantineToday = await Quarantine.countDocuments({
        //   $and: [
        //     { "date_in": { $ne: null }},
        //     { district: district },
        //   ],
        // });


        //  
      }



      let dataForBoxes = {
        confirmedCase: confirm,
        confirmedCaseToday: confirmToday,
        death: death,
        deathToday: deathToday,
        recovered: recover,
        recoveredToday: recoveredToday,
        totalHospital:totalHospital,
        totalQuarantine:totalQuarantine,
        affectedLocation:totalAffectedLocation,
        totalAffectedLocationOn:totalAffectedLocationOn,
        totalAffectedLocationClose:totalAffectedLocationClose,
        // totalAffectedLocationNew:totalAffectedLocationNew
        // totalPeopleInHospitalization,
        // totalQuarantine,
        // totalAffectedLocation,
      };
      return dataForBoxes;
    },

    getAllDistrictForMap: async (_, {}, { PersonalInfo }) => {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            confirm: {
              // Set to 1 if currentState.confirm = true
              $cond: [{ $eq: ["$currentState.confirm", true] }, 1, 0],
            },
            recovered: {
              // Set to 1 if currentState.recovered = true
              $cond: [{ $eq: ["$currentState.recovered", true] }, 1, 0],
            },
            death: {
              // Set to 1 if currentState.death = true
              $cond: [{ $eq: ["$currentState.death", true] }, 1, 0],
            },
            confirmedAt: {
              $cond: [{ $gte: ["$currentState.confirmedAt", today] }, 1, 0],
            },
            recoveredAt: {
              $cond: [{ $gte: ["$currentState.recoveredAt", today] }, 1, 0],
            },
            deathAt: {
              $cond: [{ $gte: ["$currentState.deathAt", today] }, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$district",
            confirmedCase: { $sum: "$confirm" },
            recovered: { $sum: "$recovered" },
            death: { $sum: "$death" },
            confirmedCaseToday: { $sum: "$confirmedAt" },
            recoveredToday: { $sum: "$recoveredToday" },
            deathToday: { $sum: "$deathToday" },
          },
        },
      ]);

      return data;
    },

    //@Desc getting all the data and group for the graph
    getDataForGrap: async (_, {}, { PersonalInfo }) => {
      const convert = (e) => {
        let array = [];
        let limitDate = 20;
        e.map((load) => {
          if (load._id.month !== null) {
            if (limitDate == 0) return;
            let x = {
              x: `${load._id.month}/${load._id.day}/${load._id.year}`,
              y: load.value,
            };
            limitDate -= 1;
            array.push(x);
            // }
          }
        });
       let a =  array.sort(function(a, b){return new Date(a.x) - new Date(b.x)});
        return a;
      };

      let confirm = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            value: { $sum: 1 },
          },
        },
      
      ]);
      let recovered = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.recoveredAt" },
              day: { $dayOfMonth: "$currentState.recoveredAt" },
              year: { $year: "$currentState.recoveredAt" },
            },
            value: { $sum: 1 },
          },
        },
      ]);
      let deathAt = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.deathAt" },
              day: { $dayOfMonth: "$currentState.deathAt" },
              year: { $year: "$currentState.deathAt" },
            },
            value: { $sum: 1 },
          },
        },
        // {$sort : { "$currentState.deathAt": 1 }}
        
      ]);
     
      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },

    getDataForGrapBottom: async (_, {}, { PersonalInfo }) => {
      var now = new Date(); 
     let d = now.setDate(now.getDate() - 30);
      console.log(d)

      const convert = (e) => {
        let array = [];
       let labels = [];
        let limitDate = 30;
        e.map((load) => {
          if (load._id.month !== null) {
            if (limitDate == 0) return;
            let x = {
              x: `${load._id.month}/${load._id.day}/${load._id.year}`,
              y: load.value,
            };
            limitDate -= 1;
            array.push(x);
            labels.push(x.x)
            // }
          }
        });
        console.log(labels)
       let a =  array.sort(function(a, b){return new Date(a.x) - new Date(b.x)});
        return a;
      };

      let confirm = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            value: { $sum: 1 },
          },
        },
      
      ]);
      let recovered = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.recoveredAt" },
              day: { $dayOfMonth: "$currentState.recoveredAt" },
              year: { $year: "$currentState.recoveredAt" },
            },
            value: { $sum: 1 },
          },
        },
      ]);
      let deathAt = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.deathAt" },
              day: { $dayOfMonth: "$currentState.deathAt" },
              year: { $year: "$currentState.deathAt" },
            },
            value: { $sum: 1 },
          },
        },
        // {$sort : { "$currentState.deathAt": 1 }}
        
      ]);
     
      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },

    getDataForBarGraphTotal:async(_,{},{PersonalInfo})=>{
      const  confirm = await PersonalInfo.countDocuments({
         $and: [{ "currentState.confirm": true }],
       });
       const recovered = await PersonalInfo.countDocuments({
         $and: [{ "currentState.recovered": true }],
       });
      const  deaths = await PersonalInfo.countDocuments({
         $and: [{ "currentState.death": true }],
       });
       return {
         confirm,
         recovered,
         deaths
       }
     },




    // @Desc getting the data for report
    //auth and private
    getDataForReport: async (_, { start, end }, { PersonalInfo }) => {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            menConfirmToday: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
              { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
            },
            womenConfirmToday: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
             { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
            },
             menConfirm: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
              { $eq: [ "$currentState.confirm",true] }] }, 1,0 ]
            },
            womenConfirm: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
              { $eq: [ "$currentState.confirm",true] }] }, 1,0 ]
          },

          //For Recovery
          menRecoveredToday: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
            { $gte: [ "$currentState.recoveredAt",today] }] }, 1,0 ]
          },
          womenRecoveredToday: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
           { $gte: [ "$currentState.recoveredAt",today] }] }, 1,0 ]
          },
           menRecovered: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
            { $eq: [ "$currentState.recovered",true] }] }, 1,0 ]
          },
          womenRecovered: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
            { $eq: [ "$currentState.recovered",true] }] }, 1,0 ]
        },

        //For Deaths
        menDeathsToday: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
          { $gte: [ "$currentState.deathAt",today] }] }, 1,0 ]
        },
        womenDeathsToday: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
         { $gte: [ "$currentState.deathAt",today] }] }, 1,0 ]
        },
         menDeaths: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
          { $eq: [ "$currentState.death",true] }] }, 1,0 ]
        },
        womenDeaths: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
          { $eq: [ "$currentState.death",true] }] }, 1,0 ]
      },
        //
          },
        },
        {
          $group: {
            _id: "$district",
            menConfirmToday: { $sum: "$menConfirmToday" },
           womenConfirmToday: { $sum: "$womenConfirmToday" },
           menConfirm: { $sum: "$menConfirm" },
           womenConfirm: { $sum: "$womenConfirm" },
           
           menRecoveredToday: { $sum: "$menConfirmToday" },
           womenRecoveredToday: { $sum: "$womenRecoveredToday" },
           menRecovered: { $sum: "$menRecovered" },
           womenRecovered: { $sum: "$womenRecovered" },

           menDeathsToday: { $sum: "$menDeathsToday" },
           womenDeathsToday: { $sum: "$womenDeathsToday" },
           menDeaths: { $sum: "$menDeaths" },
           womenDeaths: { $sum: "$womenDeaths" },
          },
        },
      ]);
   return data
     
    },

    //for resport 
 affectedLocationReport: async(_,{},{AffectedLocation})=>{
        let today = new Date();
        today.setHours(0, 0, 0, 0); // set to 0:00
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
// ទីតាំពាក់ព័ន
//1
     let totalAffectedLocation = await AffectedLocation.countDocuments({});
//2
    let totalAffectedLocationToday = await AffectedLocation.countDocuments({
    "createdAt": { $gte: today, $lt: tomorrow },
    });
//3
    let totalAffectedLocationNotClosed = await AffectedLocation.countDocuments({
      $and: [{ openAt: {$eq: null} }, { closeAt: {$eq: null} }],
    });
//4
    let totalAffectedLocationOn = await AffectedLocation.countDocuments({
      $and: [
        { openAt: {$ne: null} },
        { closeAt: {$eq: null}},
        { openAt:{ $gte: today, $lt: tomorrow }} ],
    });
//5 
let closedLocation = await AffectedLocation.countDocuments({
  $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} }],
});
//6
let closedLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { closeAt: {$eq: null}},
    { openAt: {$ne: null} },
    { closeAt:{ $gte: today, $lt: tomorrow }} ],
});

//7
let openedLocation = await AffectedLocation.countDocuments({
  $and: [{ openAt: {$ne: null} }, { closeAt: {$ne: null} }],
});
//8
let openedLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { closeAt: {$ne: null}},
    { openAt: {$ne: null} },
    { openAt:{ $gte: today, $lt: tomorrow }} ],
});
//9 
let coorporateLocation = await AffectedLocation.countDocuments({
  $and: [{ coorporate: {$eq: false} } ],
});
//10
let coorporateLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { coorporate: {$ne: null} },
    { createdAt:{ $gte: today, $lt: tomorrow }} ],
});

return {
  totalAffectedLocation,
  totalAffectedLocationToday,
  totalAffectedLocationNotClosed,
  totalAffectedLocationOn,
  closedLocation,
  coorporateLocation,
  coorporateLocationToday,
  openedLocation,
  openedLocationToday,
  closedLocationToday
}
 },

 interviewForReport3Times:async(_,{},{PersonalInfo})=>{
   //1
    // let totolInterviewed = await PersonalInfo.countDocuments({
    //   $and: [{ interviewed: {$eq: true} }],
    // })
    // const data = await PersonalInfo.aggregate([
    //   {
    //     $project: {
    //       nationality: 1,
    //   //For Deaths
    //   // womenDeathsToday: {
    //   //   { $gte: [ "$currentState.confirm",today],1,0} ]
    //   // },

    //   // womenDeathsToday: {
    //   //   $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
    //   //   { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
    //   // },
     
    // //   womenDeaths: {
    // //     $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
    // //     { $eq: [ "$currentState.death",true] }] }, 1,0 ]
    // // },
    //   //
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$district",
    //       menConfirmToday: { $sum: "$menConfirmToday" },
    //     },
    //   },
    // ]);

    const totalInterview = await PersonalInfo.countDocuments({
      $and:[ { interviewed: {$eq: true} }]
    })
    console.log(totalInterview)
    return totalInterview;
 }
  },
};


// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });



