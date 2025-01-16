import { UserCreation } from "../../pageObject/Users/UserCreation";
import { FacilityCreation } from "../../pageObject/facility/FacilityCreation";
import {
  generateName,
  generatePhoneNumber,
  generateUsername,
} from "../../utils/commonUtils";

describe("User Creation", () => {
  const facilityCreation = new FacilityCreation();
  const userCreation = new UserCreation();
  const userRole = "Doctor";

  beforeEach(() => {
    cy.visit("/login");
    cy.loginByApi("admin");
  });

  it("should create a new user successfully", () => {
    // Generate fresh data at the start of each test attempt
    const fullName = generateName();
    const [firstName, lastName] = fullName.split(" ");
    const defaultPassword = "Test@123";

    const testUserData = {
      firstName,
      lastName,
      username: generateUsername(firstName),
      password: defaultPassword,
      confirmPassword: defaultPassword,
      email: `${generateUsername(firstName)}@test.com`,
      phoneNumber: generatePhoneNumber(),
      dateOfBirth: "1990-01-01",
      userType: "Doctor",
      state: "Kerala",
      district: "Ernakulam",
      localBody: "Aluva",
      ward: "4",
    };

    facilityCreation.navigateToOrganization("Kerala");

    userCreation
      .navigateToUsersTab()
      .clickAddUserButton()
      .fillEmail(testUserData.email)
      .submitUserForm()
      .verifyValidationErrors()
      .fillUserDetails(testUserData)
      .interceptUserCreationRequest()
      .submitUserForm()
      .verifyUserCreationApiCall()
      .selectUserRole(userRole)
      .interceptOrganizationUserLinking()
      .clickLinkToOrganization()
      .verifyOrganizationUserLinkingApiCall();
  });
});
