import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
   
    allPersonalInfos: [PersonalInfo!]!
    getPersonalInfoById(id: ID!): PersonalInfo!
    # for police
    getPatientForInterviewWithPagination(page:Int, limit:Int, keyword:String,interview:Boolean,startDate:Date, endDate:Date): PaginateResponse!
    getPeopleForQuarantineWithPagination(page:Int, limit:Int, keyword:String,quarantineInfoId:ID!): PaginateResponse!
    getAffectedPersonalListWithPagination(page:Int, limit:Int, keyword:String,patientId:ID!):PaginateResponse!
    # for the doctor 
    getPatientForHospitalPagination(page:Int, limit:Int, keyword:String,active:String,startDate:Date, endDate:Date): PaginateResponse!
    getPeopleForSampleTestWithPagination(page:Int, limit:Int, keyword:String,startDate:Date, endDate:Date): PaginateResponse!
  
    getConfirmedPersonalInfoByInterviewWithPagination(
      interview:Boolean, 
      page: Int!
      limit: Int!
      keyword: String
      ): PaginateResponse!
    getPersonalInfoWithPagination(
      page: Int!
      limit: Int!
      keyword: String
    ): PaginateResponse!
    getPersonalInfoByCaseWithPagination(
      page: Int!
      limit: Int!
      keyword: String
      caseId:ID!
    ): PaginateResponse!
  }
  extend type Mutation {
    createPersonalInfo(newInfo: PersonalInfoInput!): PersonalInfoResponseWithData
    recordSampleTest(sampleTest:SampleTestInput!,personalInfoId:ID!):PersonalInfoResponse!

    updatePersonalInfo(
      updatedInfo: PersonalInfoInput!
      id: ID!
    ): PersonalInfoResponse
    deletePersonalInfo(id: ID!): PersonalInfoResponse
    deleteSampleTest(personalInfoId:ID!,sampleTestId:ID!):PersonalInfoResponse
    updateSampleTest(personalInfoId:ID!,sampleTestId:ID!,sampleTest:SampleTestInput):PersonalInfoResponse
    updateCurrentState(personalInfoId:ID!,updateValue:currentStatusInput):PersonalInfoResponse


  # For police 
  addHistoryWithin14days(createLocation:HistoryWithin14daysInput,personalInfoId:ID!):PersonalInfoResponse
  deleteHistoryWithin14days(personalInfoId:ID!,historyWithin14Id:ID!):PersonalInfoResponse

  addPeopleToQuarantine(newQuarantine:QuarantingInput,personalInfo:ID!):PersonalInfoResponse
  deletePeopleFromQuarantine(personalInfoId:ID!,quarantingId:ID!):PersonalInfoResponse



  # //delete  left 
  # //update left 
  }
 
  type PersonalInfo {
    englishName:String,
    patientId:String
    id: ID
    firstName: String
    lastName: String
    age: Int
    gender: String
    tel: String
    dob: Date
    nationality: String
    occupation: String
    idCard: String
    profileImg: String
    village: String
    commune: String
    district: String
    province: String
    case:Case
    direct: Boolean
    other:String
    relapse: Boolean
    relapseAt: Date
    vaccination: [Vaccination]
    createdAt: Date
    updatedAt: Date
    interviewed: Boolean
    interviewedAt:Date
    currentState: currentStatus
    sampleTest:[SampleTest]
    travelOverCountryHistory:TravelOverCountryHistory
    chronic:String,
    covidVariant:String,
    hospitalizations:[Hospitalizations]
    historyWithin14days:[HistoryWithin14days]
    affectedFrom: AffectedFrom
    quaranting:[Quarantings]
  }

  type Vaccination{
    date:Date
    times:Int 
    vaccineType:String
    vacinatedAt:String
  }
  input VaccinationInput{
    date:Date
    times:Int 
    vaccineType:String
    vacinatedAt:String
  }
  type Quarantings{
        id:ID
        coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:QuarantineInfo
        locationType:String
        locationName:String,
        long:Float,
        lat:Float
  }
  input QuarantingInput{
        locationType:String
        coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:ID!
        locationName:String,
        lat:Float
        long:Float
  }
  type currentStatus{
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        death:Boolean,
        deathAt:Date,
        covidVariant:String
  }
  type SampleTest{
    id:ID!
    date: Date,
    times:Int,
    testLocation:String,
    result:Boolean,
    symptom:String,
    other:String,
    reasonForTesting:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String,
    covidVariant:String,
    resultDate:Date
    testType:String
  }
  type TravelOverCountryHistory{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
    input TravelOverCountryHistoryInput{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
  input SampleTestInput{
    covidVariant:String,
    reasonForTesting:String,
    date: Date,
    times:Int,
    testLocation:String,
    result:Boolean,
    symptom:String,
    other:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String
    resultDate:Date
    testType:String
  }
  input currentStatusInput{
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        death:Boolean,
        deathAt:Date
        covidVariant:String
  }

  
  input PersonalInfoInput {
    covidVariant:String,
    englishName:String,
    patientId:String
    currentState:currentStatusInput
    firstName: String
    interviewed:Boolean
    interviewedAt:Date
    lastName: String
    age: Int
    case:ID
    dob: Date
    direct: Boolean
    gender: String
    other:String
    tel: String
    nationality: String
    occupation: String
    idCard: String
    profileImg: String
    village: String
    commune: String
    district: String
    province: String
    relapse: Boolean
    relapseAt: Date
    chronic:String
    travelOverCountryHistoryHistory:TravelOverCountryHistoryInput
    affectedFrom: AffectedFromInput
    historyWithin14daysInput:HistoryWithin14daysInput
    vaccination:VaccinationInput
    sampleTest:SampleTestInput
  }
  type PersonalInfoResponse {
    success: Boolean
    message: String
  }
type PersonalInfoResponseWithData{
  response : PersonalInfoResponse
  personalInfo:PersonalInfo!
}
  type PaginateResponse {
    paginator: Paginator
    personalInfos: [PersonalInfo!]!
  }

  type HistoryWithin14days {
    id:ID!
    locationName: String
    lat:Float 
    long:Float
    affectedLocation: AffectedLocation
    date: Date
    description: String
    direct:Boolean
  }

  input HistoryWithin14daysInput {
    locationName: String
    affectedLocation: ID!
    date: Date
    lat:Float 
    long:Float
    description: String
    direct:Boolean
  }
  type AffectedFrom{
    date:Date
    patientName:String
    patientCode: String
    relation:String
    direct:Boolean
    otherAffect:String
  }

  input AffectedFromInput{
    date:Date
    patientName:String
    patientCode: String
    relation: String
    direct: Boolean
    otherAffect:  String
  }
  type Hospitalizations{
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: HospitalInfo
    covidVariant: String
    coorporate: Boolean
    description: String
    long:Float,
    lat:Float,
  }

  input HospitalizationsInput{
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: ID!
    covidVariant: String
    coorporate: Boolean
    description: String
    long:Float,
    lat:Float,
  }
`;
