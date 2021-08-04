const PersonalInfoLabels = {
  docs: "personalInfos",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalDocs",
  totalPages: "totalPages",
};

export default {
  Query: {
    //For Doctor

    //@Desc get perfornal info for the Hospital
    //@Access police

    getPeopleForSampleTestWithPagination: async (_, {page,limit,keyword,startDate,endDate}, { PersonalInfo }) => {
      const options = {
        page: page || 1,
        limit: limit || 25,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: 1,
        },
        //   populate: "case",
      };

      let query;
      let start;
      let end;
     if(startDate !== null || endDate!==null){
              start = startDate
              end = endDate 
              // console.log(startDate.toString(),endDate.toString())
              if(startDate.toString() === endDate.toString()){
                let start  = new Date(startDate)
                  start.setHours(0, 0, 0, 0)
                  end = new Date(startDate)
                  end.setDate(start.getDate() + 1)
              }
    
         query = {
           $and: [
             {
               $or: [
                 { patientId: { $regex: keyword, $options: "i" } },
                 { englishName: { $regex: keyword, $options: "i" } },
                 { firstName: { $regex: keyword, $options: "i" } },
                 { lastName: { $regex: keyword, $options: "i" } },
                 { village: { $regex: keyword, $options: "i" } },
                 { commune: { $regex: keyword, $options: "i" } },
                 { disctrict: { $regex: keyword, $options: "i" } },
                 { province: { $regex: keyword, $options: "i" } },
                 { patientId: { $regex: keyword, $options: "i" } },
                 { idCard: { $regex: keyword, $options: "i" } },
                 { tel: { $regex: keyword, $options: "i" } },
               ],
             },
             // { "currentState.confirm": false },
             { "sampleTest": { $ne: []} },
             // { "sampleTest.date": { $gte: startDate, $lt: endDate } },
             // { sampleTest: { $elemMatch: {  } }
             { sampleTest: { $elemMatch: { date: { $gte: start, $lt: end } } } }
           ],
         };
        
    }else{
      query = {
        $and: [
          {
            $or: [
              { patientId: { $regex: keyword, $options: "i" } },
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
              { tel: { $regex: keyword, $options: "i" } },
            ],
          },
          // { "currentState.confirm": false },
          { "sampleTest": { $ne: []} },
          // { "sampleTest.date": { $gte: startDate, $lt: endDate } },
          // { sampleTest: { $elemMatch: {  } }
        ],
      };
    }

    const personalInfos = await PersonalInfo.paginate(query, options);
    return personalInfos;
    },

    //@Desc get perfornal info for the Hospital
    //@Access police

    getPatientForHospitalPagination: async (_, {}, { PersonalInfo }) => {
      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { tel: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "currentState.confirm": false },
          { "quarantine.date_in": { $ne: null } },
          { "quarantine.date_in": { $gte: startDate, $lt: endDate } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    // the police
    //@Desc get perfornal info for the qurantine
    //@Access police

    getPeopleForQuarantineWithPagination: async (_, {quarantineInfoId, limit,page,keyword}, { PersonalInfo }) => {

      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { tel: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "quaranting.quarantineInfo": {$eq:quarantineInfoId} },
          // { "currentState.confirm": { $eq: quarantineInfoId } },
          // { "quarantine.date_in": { $ne: null } },
          // { "quarantine.date_in": { $gte: startDate, $lt: endDate } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc get patient for interview 
    //Access police

    getPatientForInterviewWithPagination: async (
      _,
      { page, limit, keyword = "", interview, startDate, endDate },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "currentState.confirm": true },
          { interviewed: interview },
          // { "currentState.confirmedAt": { $gte: startDate, $lt: endDate } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
  
      return personalInfos;
    },
    //Des

    //@Desc get affected Personalist
    //Access police

    getAffectedPersonalListWithPagination: async (
      _,
      { page, limit, keyword = "", patientId },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "currentState.confirm": true },
          { "affectedFrom.patientCode": patientId },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },
    //@Desc get all the personalInfo that is confirmed  for interview
    // @Access Auth
    getConfirmedPersonalInfoByInterviewWithPagination: async (
      _,
      { page, limit, keyword = "", interview },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "currentState.confirm": true },
          { interviewed: interview },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting all the persinal info
    //@access private
    //

    allPersonalInfos: async (_, {}, { PersonalInfo }) => {
      const personalInfos = await PersonalInfo.find({}).populate("case");
      return personalInfos;
    },
    //@Desc Getting all the persoanl Info with pagination
    //@access auth
    getPersonalInfoWithPagination: async (
      _,
      { page, limit, keyword },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "case",
      };

      let query = {
        $or: [
          { tel: { $regex: keyword, $options: "i" } },
          { idCard: { $regex: keyword, $options: "i" } },
          { englishName: { $regex: keyword, $options: "i" } },
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { village: { $regex: keyword, $options: "i" } },
          { commune: { $regex: keyword, $options: "i" } },
          { disctrict: { $regex: keyword, $options: "i" } },
          { province: { $regex: keyword, $options: "i" } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      
      return personalInfos;
    },

    //@Desc getting all the info by case Id with pagination \
    //@Access Auth

    getPersonalInfoByCaseWithPagination: async (
      _,
      { page, limit, keyword, caseId },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "case",
      };

      let query = {
        $and: [
          {
            $or: [
              { tel: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
            ],
          },
          { case: { $eq: caseId.toString() } },
        ],
      };

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting the personalInfo by id
    //@access auth

    getPersonalInfoById: async (_, { id }, { PersonalInfo }) => {
      const persoanalInfo = await PersonalInfo.findOne({_id:id});
      return persoanalInfo;
    },
  },

  Mutation: {
//@Decs Delete the people from the quranrantine 
//@Access 

deletePeopleFromQuarantine:async(_,{personalInfoId,quarantingId},{PersonalInfo})=>{
  try {
    let a = await PersonalInfo.updateOne(
      { _id: personalInfoId },
      {
        $pull: { quaranting: { quarantineInfo: quarantingId } },
      }
    );
    return {
      success: true,
      message: "Deleted Successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
},
    //@Desc update simple test 
    //@access doctor

    updateSampleTest: async (
      _,
      { personalInfoId, sampleTestId,sampleTest },
      { PersonalInfo }
    ) => {
      console.log(sampleTest)
      try {
 await PersonalInfo.findById(personalInfoId)
     
 await PersonalInfo.updateOne({"_id" : personalInfoId, "sampleTest._id" : sampleTestId},{$set : {"sampleTest":sampleTest}})
    console.log(a)
        return {
          success: true,
          message: "Update Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot update the sample test please contact the admin for help",
        };
      }
    },

    // For police
    addPeopleToQuarantine: async (
      _,
      { personalInfo, newQuarantine },
      { PersonalInfo }
    ) => {
      try {
        let isExisted = await PersonalInfo.findById(personalInfo);
        if (!isExisted) {
          return {
            message: "មិនអាចបញ្ចូលបានទេព្រោះគ្មានបុគ្គលនេះទេ",
            success: false,
          };
        }
  
        let a = await PersonalInfo.updateOne(
          { _id: personalInfo },
          {
            $push: {
              quaranting: {
                $each: [newQuarantine],
                // $sort: { score: 1 },
                $slice: -5,
              },
            },
          }
        );
        return {
          message: "បញ្ចូលបានជោកជ័យ",
          success: true,
        };
      } catch (error) {
        return {
          message: "មិនអាចបញ្ចូលបានទេ",
          success: error.message,
        };
      }
    },

    //@Desc add history within 14 days
    //@Access police
    addHistoryWithin14days: async (
      _,
      { createLocation, personalInfoId },
      { PersonalInfo }
    ) => {
      try {
        let isExisted = await PersonalInfo.findById(personalInfoId);
        if (!isExisted) {
          return {
            message: "មិនអាចបញ្ចូលបានទេ",
            success: false,
          };
        }
     

        await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $push: {
              historyWithin14days: {
                $each: [createLocation],
                $slice: -50,
              },
            },
          }
        );
        return {
          message: "បញ្ចូលបានជោកជ័យ",
          success: true,
        };
      } catch (error) {
        return {
          message: "មិនអាចបញ្ចូលបានទេ",
          success: error.message,
        };
      }
    },

    //@Desc update the current State
    //@Access auth
    updateCurrentState: async (
      _,
      { personalInfoId, updateValue },
      { PersonalInfo }
    ) => {
      try {
        const updated = await PersonalInfo.update(
          { _id: personalInfoId },
          {
            $set: {
              currentState: updateValue,
            },
          }
        );
        if (!updated) {
          return {
            success: false,
            message: "Cannot this status ",
          };
        }
        return {
          success: true,
          message: "Updated successfully ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    //@Desc add Sample test to the hospitalization
    //@Access goglobal
    recordSampleTest: async (
      _,
      { sampleTest, personalInfoId },
      { PersonalInfo }
    ) => {
      console.log(sampleTest)
      try {
        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { sampleTest: sampleTest } }
        );
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }
        return {
          success: true,
          message: "ជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

     // @Desc delete History within 14 days
    // @auth

    deleteHistoryWithin14days: async (
      _,
      { personalInfoId, historyWithin14Id },
      { PersonalInfo }
    ) => {
      try {
        console.log(historyWithin14Id,personalInfoId)
   
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { historyWithin14days: { _id: historyWithin14Id } },
          }
        );

        return {
          success: true,
          message: "Deleted Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot delete please ask admin",
        };
      }
    },

    // @Desc delete sample Test
    // @auth

    deleteSampleTest: async (
      _,
      { personalInfoId, sampleTestId },
      { PersonalInfo }
    ) => {
      try {
   
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { sampleTest: { _id: sampleTestId } },
          }
        );

        return {
          success: true,
          message: "Deleted Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    //@Desc create new Personal Info
    //@access auth
    createPersonalInfo: async (_, { newInfo }, { PersonalInfo }) => {
    
      try {
        const info = new PersonalInfo(newInfo);
        const personalInfo = await info.save()
        console.log(personalInfo)
        if (!personalInfo) {
          return {
            response :{
              message: "Cannot create personal Info",
              success: false,
            },
            personalInfo:{}
          };
        }
        return {
          response :{
            message: "success",
            success: true,
          },
          personalInfo:personalInfo
        };
      } catch (error) {
        return {
          response :{
            message: "Cannot create personal Info",
            success: false,
          },
          personalInfo:personalInfo
        };
      }
    },

    //@Desc delete the personal info
    //@access admin

    deletePersonalInfo: async (_, { id }, { PersonalInfo }) => {
      try {
        const deletedInfo = await PersonalInfo.findByIdAndDelete(id);

        if (!deletedInfo) {
          return {
            success: false,
            message: "cannot delete this record",
          };
        }
        return {
          success: true,
          message: "Personal Info deleted successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot delete this record please contact the admin",
        };
      }
    },

    //@Desc update the personal info
    //@access auth

    updatePersonalInfo: async (_, { id, updatedInfo }, { PersonalInfo }) => {
      try {
        const isUpdated = await PersonalInfo.findByIdAndUpdate(id, updatedInfo);
        if (!isUpdated) {
          return {
            success: false,
            message: "Personal Info updated not successfully",
          };
        }
        return {
          success: true,
          message: "Cannot update this record please contact the admin",
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot update this record please contact the admin",
        };
      }
    },
  },
};
