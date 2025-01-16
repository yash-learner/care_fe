export class FacilityCreation {
  // Navigation
  navigateToOrganization(orgName: string) {
    cy.verifyAndClickElement('[data-cy="organization-list"]', orgName);
  }

  navigateToFacilitiesList() {
    cy.verifyAndClickElement('[data-cy="org-nav-facilities"]', "Facilities");
  }

  selectFacility(facilityName: string) {
    cy.verifyAndClickElement("[data-cy='facility-list']", facilityName);
    return this;
  }

  clickAddFacility() {
    cy.get('[data-cy="add-facility-button"]').should("be.visible").click();
  }

  // Individual field methods
  enterFacilityName(name: string) {
    cy.typeIntoField('[data-cy="facility-name"]', name);
  }

  selectFacilityType(facilityType: string) {
    cy.clickAndSelectOption('[data-cy="facility-type"]', facilityType);
  }

  enterDescription(description: string) {
    cy.typeIntoField('[data-cy="facility-description"]', description);
  }

  enterPhoneNumber(phone: string) {
    cy.typeIntoField('[data-cy="facility-phone"]', phone, {
      skipVerification: true,
    });
  }

  enterPincode(pincode: string) {
    cy.typeIntoField('[data-cy="facility-pincode"]', pincode);
  }

  enterAddress(address: string) {
    cy.typeIntoField('[data-cy="facility-address"]', address);
  }

  enterLatitude(latitude: string) {
    cy.typeIntoField('[data-cy="facility-latitude"]', latitude);
  }

  enterLongitude(longitude: string) {
    cy.typeIntoField('[data-cy="facility-longitude"]', longitude);
  }

  // Combined methods using individual functions
  fillBasicDetails(name: string, facilityType: string, description: string) {
    this.enterFacilityName(name);
    this.selectFacilityType(facilityType);
    this.enterDescription(description);
  }

  selectFeatures(features: string[]) {
    cy.clickAndMultiSelectOption("#facility-features", features);
  }

  fillContactDetails(phone: string, pincode: string, address: string) {
    this.enterPhoneNumber(phone);
    this.enterPincode(pincode);
    this.enterAddress(address);
  }

  fillLocationDetails(latitude: string, longitude: string) {
    this.enterLatitude(latitude);
    this.enterLongitude(longitude);
  }

  makePublicFacility() {
    cy.get('[data-cy="make-facility-public"]').click();
  }

  submitFacilityCreationForm() {
    cy.clickSubmitButton("Create Facility");
  }

  // Verification Methods
  verifySuccessMessage() {
    cy.verifyNotification("Facility created successfully");
  }

  verifyValidationErrors() {
    cy.verifyErrorMessages([
      { label: "Facility Name", message: "Name is required" },
      { label: "Facility Type", message: "Facility type is required" },
      { label: "Address", message: "Address is required" },
      {
        label: "Phone Number",
        message: "Phone number must start with +91 followed by 10 digits",
      },
      { label: "Pincode", message: "Invalid pincode" },
    ]);
  }

  searchFacility(facilityName: string) {
    cy.intercept("GET", `**/api/v1/facility/?**`).as("searchFacility");

    // Split string into array of characters using spread in Array.from
    Array.from(facilityName).forEach((char, index) => {
      cy.get('[data-cy="search-facility"]').type(char, {
        delay: 500,
        force: true,
      });

      // Wait for the last character's API call
      if (index === facilityName.length - 1) {
        cy.wait("@searchFacility").its("response.statusCode").should("eq", 200);
      }
    });
  }

  verifyFacilityNameInCard(facilityName: string) {
    cy.get('[data-cy="facility-cards"]').should("contain", facilityName);
  }

  waitForFacilityCardsToLoad(timeout = 10000) {
    cy.get('[data-cy="facility-cards"]', { timeout })
      .should("be.visible")
      .should("not.be.empty");
  }
}
