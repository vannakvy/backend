
const HospitalizationLabels = {
    docs: "hospitalizations",
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
    Query:{

        //@Desc hospital location 
        //@access private 
        //

        allHospitalizations:async(_,{},{Hospitalization})=>{
            const Hospitalizations = await Hospitalization.find({});
            return Hospitalizations;
        },
        //@Desc Getting all Hospitalizations  with pagination 
        //@access auth
        getHospitalizationWithPagination:async(_,{page,limit,keyword},{Hospitalization})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: HospitalizationLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "customer",
              };

              let query = {
                $or: [
                  { hostpitalName: { $regex: keyword, $options: "i" } },
                  { village: { $regex: keyword, $options: "i" } },
                  { commune: { $regex: keyword, $options: "i" } },
                  { disctrict: { $regex: keyword, $options: "i" } },
                  { province: { $regex: keyword, $options: "i" } },
                ],
              };

              const hospitalizations = await Hospitalization.paginate(query, options);
              console.log(hospitalizations)
              return hospitalizations;
        },

        //@Desc getting the Hospitalization by id
        //@access auth

        getHospitalizationById:async(_  ,{id},{Hospitalization})=>{
            const Hospitalizations = await Hospitalization.findById(id);
            return Hospitalizations
        },
    },
    Mutation:{

        //@Desc create new Hospitalization
        //@access auth
        createHospitalization:async(_,{newHospitalization},{Hospitalization})=>{
            try {
                
                const isExisted = await Hospitalization.findOne({hostpitalName:newHospitalization.hostpitalName});
                console.log(isExisted)
                if(isExisted){
                    return{
                        message:"The hospital with this name is already exist",
                        success: false
                    }
                }
                const hospitalizations = new Hospitalization(newHospitalization);
                const isCreated = await hospitalizations.save();
                if(!isCreated){
                    return {
                        message:"Cannot create Hospitalization",
                        success: false
                    }
                }
                return {
                    message:"Hospitalization created successfully!",
                    success: true
                }
            } catch (error) {
                return {
                    message:error.message ,
                    success: false
                }
            }
        },

        //@Desc delete the Hospitalization
        //@access admin 

        deleteHospitalization:async(_,{id},{Hospitalization})=>{
            try {
                const deletedHos = await Hospitalization.findByIdAndDelete(id);

                if(!deletedHos){
                    return {
                        success: false,
                        message: "cannot delete this record"
                    }
                }
                return {
                    success: true,
                    message: "Hospitalization deleted successfully"
                }
            } catch (error) {
                return {
                    success: false,
                    message: "Cannot delete this record please contact the admin"
                }
            }
        },

        //@Desc update the personal info
        //@access auth

        updateHospitalization:async(_,{id,updatedHospitalization},{Hospitalization})=>{
            console.log(updatedHospitalization)
            try {
                const isUpdated = await Hospitalization.findByIdAndUpdate(id,updatedHospitalization);
                if(!isUpdated){
                    return {
                        success: false,
                        message: "Hospitalization updated not successfully"
                    }
                }            
                return {
                    success: true,
                    message: "Hospitalization updated successfully !"
                }

            } catch (error) {
                return {
                    success: false,
                    message: "cannot update the Hospitalization please contact the admin"
                }
            }
        }
    }
}




