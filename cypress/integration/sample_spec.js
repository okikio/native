describe("My first test", () => {
    it("Click an element", () => {
        // Arrange - setup initial app state
        // - visit a web page
        // - query for an element
        // Act - take an action
        // - interact with that element
        // Assert - make an assertion
        // - make an assertion about page content
        cy.visit("https://example.cypress.io");

        cy.pause();
        cy.contains("type").click();

        cy.url().should("include", "/commands/actions");
        cy.get(".action-email")
            .type("fake@email.com")
            .should("have.value", "fake@email.com");
    });
});
