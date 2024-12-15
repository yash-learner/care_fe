import LoginPage from "../../pageobject/Login/LoginPage";
import {
  PatientData,
  PatientPage,
} from "../../pageobject/Patient/PatientCreation";
import PatientInsurance from "../../pageobject/Patient/PatientInsurance";
import PatientMedicalHistory from "../../pageobject/Patient/PatientMedicalHistory";
import PatientTransfer from "../../pageobject/Patient/PatientTransfer";
import { generatePhoneNumber } from "../../pageobject/utils/constants";

const yearOfBirth = "2001";

const calculateAge = () => {
  const currentYear = new Date().getFullYear();
  return currentYear - parseInt(yearOfBirth);
};

const getRelativeDateString = (deltaDays = 0) => {
  const date = new Date();
  if (deltaDays) {
    date.setDate(date.getDate() + deltaDays);
  }
  return date
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "");
};

describe("Patient Creation with consultation", () => {
  const loginPage = new LoginPage();
  const patientPage = new PatientPage();
  const patientTransfer = new PatientTransfer();
  const patientInsurance = new PatientInsurance();
  const patientMedicalHistory = new PatientMedicalHistory();
  const phone_number = generatePhoneNumber();
  const age = calculateAge();
  const patientFacility = "Dummy Facility 40";
  const patientDateOfBirth = "01012001";
  const patientMenstruationStartDate = getRelativeDateString(-10);
  const patientDateOfDelivery = getRelativeDateString(-20);
  const patientOneName = "Great Napolean 14";
  const patientOneGender = "Male";
  const patientOneUpdatedGender = "Female";
  const patientOneAddress = `149/J, 3rd Block,
  Aluva
  Ernakulam, Kerala - 682001`;
  const patientOnePincode = "682001";
  const patientOneState = "Kerala";
  const patientOneDistrict = "Ernakulam";
  const patientOneLocalbody = "Aluva";
  const patientOneWard = "4";
  const patientOnePresentHealth = "Present Health Condition";
  const patientOneOngoingMedication = "Ongoing Medication";
  const patientOneAllergies = "Allergies";
  const patientOneBloodGroup = "O+";
  const patientOneUpdatedBloodGroup = "AB+";
  const patientOneFirstInsuranceId = "insurance-details-0";
  const patientOneFirstSubscriberId = "member id 01";
  const patientOneFirstPolicyId = "policy name 01";
  const patientOneFirstInsurerName = "Demo Payor";
  const patientOneSecondInsuranceId = "insurance-details-1";
  const patientOneSecondSubscriberId = "member id 02";
  const patientOneSecondPolicyId = "policy name 02";
  const patientOneSecondInsurerName = "Care Payor";
  const patientTransferPhoneNumber = "9849511866";
  const patientTransferFacility = "Dummy Shifting Center";
  const patientTransferName = "Dummy Patient Twelve";
  const patientOccupation = "Student";
  const newPatientData: PatientData = {
    facility: patientFacility,
    phoneNumber: phone_number,
    isEmergencyNumber: true,
    age: age.toString(),
    name: patientOneName,
    gender: patientOneGender,
    address: patientOneAddress,
    pincode: patientOnePincode,
    state: patientOneState,
    district: patientOneDistrict,
    localBody: patientOneLocalbody,
    ward: patientOneWard,
    occupation: patientOccupation,
    socioeconomicStatus: "MIDDLE_CLASS",
    domesticHealthcareSupport: "FAMILY_MEMBER",
    medicalHistory: {
      presentHealth: patientOnePresentHealth,
      ongoingMedication: patientOneOngoingMedication,
      conditions: [
        { index: 2, condition: "Diabetes" },
        { index: 3, condition: "Heart Disease" },
        { index: 4, condition: "HyperTension" },
        { index: 5, condition: "Kidney Diseases" },
        { index: 6, condition: "Lung Diseases/Asthma" },
        { index: 7, condition: "Cancer" },
        { index: 8, condition: "Other" },
      ],
      allergies: patientOneAllergies,
    },
    bloodGroup: patientOneBloodGroup,
  };

  before(() => {
    loginPage.loginByRole("districtAdmin");
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.clearLocalStorage(/filters--.+/);
    cy.awaitUrl("/patients");
  });

  it("Create a new patient with all field in registration form and no consultation", () => {
    patientPage.createPatientWithData(newPatientData);
    // Verify the patient details
    patientPage.clickCancelButton();
    cy.wait(3000);
    patientPage.savePatientUrl();
    patientPage.verifyPatientDashboardDetails(
      patientOneGender,
      age,
      patientOneName,
      phone_number,
      phone_number,
      yearOfBirth,
      patientOneBloodGroup,
      patientOccupation,
      "Middle Class",
      "Family member",
    );

    patientMedicalHistory.verifyPatientMedicalDetails(
      patientOnePresentHealth,
      patientOneOngoingMedication,
      patientOneAllergies,
      "Diabetes",
      "Heart Disease",
      "HyperTension",
      "Kidney Diseases",
      "Lung Diseases/Asthma",
      "Cancer",
      "Other",
    );
    // verify its presence in the patient detail page
    cy.visit("/patients");
    patientPage.typePatientNameList(patientOneName);
    patientPage.verifyPatientNameList(patientOneName);
  });

  it("Edit the patient details with no consultation and verify", () => {
    patientPage.interceptFacilities();
    patientPage.visitUpdatePatientUrl();
    patientPage.verifyStatusCode();
    patientPage.patientformvisibility();
    // change the gender to female and input data to related changed field
    cy.wait(3000);
    patientPage.selectPatientGender(patientOneUpdatedGender);
    patientPage.typePatientDateOfBirth(patientDateOfBirth);
    patientPage.clickPatientAntenatalStatusYes();
    patientPage.typeLastMenstruationStartDate(patientMenstruationStartDate);
    patientPage.clickPatientPostPartumStatusYes();
    patientPage.typeDateOfDelivery(patientDateOfDelivery);
    patientPage.selectPatientBloodGroup(patientOneUpdatedBloodGroup);
    // Edit the patient consultation , select none medical history and multiple health ID
    patientMedicalHistory.clickNoneMedicialHistory();
    patientInsurance.clickAddInsruanceDetails();
    patientInsurance.typePatientInsuranceDetail(
      patientOneFirstInsuranceId,
      "subscriber_id",
      patientOneFirstSubscriberId,
    );
    patientInsurance.typePatientInsuranceDetail(
      patientOneFirstInsuranceId,
      "policy_id",
      patientOneFirstPolicyId,
    );
    patientInsurance.selectPatientInsurerName(
      patientOneFirstInsuranceId,
      patientOneFirstInsurerName,
    );
    patientInsurance.clickAddInsruanceDetails();
    patientInsurance.typePatientInsuranceDetail(
      patientOneSecondInsuranceId,
      "subscriber_id",
      patientOneSecondSubscriberId,
    );
    patientInsurance.typePatientInsuranceDetail(
      patientOneSecondInsuranceId,
      "policy_id",
      patientOneSecondPolicyId,
    );
    patientInsurance.selectPatientInsurerName(
      patientOneSecondInsuranceId,
      patientOneSecondInsurerName,
    );
    patientPage.clickUpdatePatient();
    cy.wait(3000);
    patientPage.verifyPatientUpdated();
    patientPage.visitPatientUrl();
    // Verify Female Gender change reflection, No Medical History and Insurance Details
    cy.wait(5000);
    patientPage.verifyPatientDashboardDetails(
      patientOneUpdatedGender,
      age,
      patientOneName,
      phone_number,
      phone_number,
      yearOfBirth,
      patientOneUpdatedBloodGroup,
      patientOccupation,
    );
    // Verify No medical history
    patientMedicalHistory.verifyNoSymptosPresent("Diabetes");
    // verify insurance details and dedicatd page
    cy.get("[data-testid=patient-details]")
      .contains("Member ID")
      .scrollIntoView();
    cy.wait(2000);
    patientInsurance.verifyPatientPolicyDetails(
      patientOneFirstSubscriberId,
      patientOneFirstPolicyId,
      patientOneFirstInsurerName,
    );
    patientInsurance.verifyPatientPolicyDetails(
      patientOneSecondSubscriberId,
      patientOneSecondPolicyId,
      patientOneSecondInsurerName,
    );
  });

  it("Patient Registration using the transfer with no consultation", () => {
    // transfer the patient with no consulation and verify the transfer to a new facility
    patientPage.createPatient();
    patientPage.selectFacility(patientTransferFacility);
    patientPage.patientformvisibility();
    patientPage.typePatientPhoneNumber(patientTransferPhoneNumber);
    patientTransfer.clickAdmitPatientRecordButton();
    patientTransfer.clickTransferPopupContinueButton();
    patientTransfer.clickTransferPatientNameList(patientTransferName);
    patientTransfer.clickTransferPatientYOB(yearOfBirth);
    patientTransfer.clickTransferSubmitButton();
    cy.verifyNotification(
      `Patient ${patientTransferName} (Male) transferred successfully`,
    );
    patientTransfer.clickConsultationCancelButton();
    // allow the transfer button of a patient
    patientTransfer.clickAllowPatientTransferButton();
    // Verify the patient error message for the same facility
    cy.awaitUrl("/patients");
    patientPage.createPatient();
    patientPage.selectFacility(patientTransferFacility);
    patientPage.patientformvisibility();
    patientPage.typePatientPhoneNumber(patientTransferPhoneNumber);
    patientTransfer.clickAdmitPatientRecordButton();
    patientTransfer.clickTransferPopupContinueButton();
    patientTransfer.clickTransferPatientNameList(patientTransferName);
    patientTransfer.clickTransferPatientYOB(yearOfBirth);
    patientTransfer.clickTransferSubmitButton();
    cy.verifyNotification(
      "Patient - Patient transfer cannot be completed because the patient has an active consultation in the same facility",
    );
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
});
