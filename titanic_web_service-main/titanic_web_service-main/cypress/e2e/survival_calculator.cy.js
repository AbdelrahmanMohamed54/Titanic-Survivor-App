describe('Survival Calculator', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080'); 
    });
  
    it('sets default values correctly', () => {
      cy.get('#age').should('have.value', '30');
      cy.get('#fare').should('have.value', '22');
    });
  
    it('can select models and get predictions', () => {
      // Select models
      cy.get('input[name="model"][value="decisionTree"]').check();
      cy.get('input[name="model"][value="knn"]').check();
  
      // Fill in the form
      cy.get('#title').select('Mr');
      cy.get('#pclass').select('1');
      cy.get('#sex').select('male');
      cy.get('#age').clear().type('25');
      cy.get('#fare').clear().type('50');
      cy.get('#alone').select('true');
      cy.get('#embarked').select('C');
  
      // Submit the form and check the results
      cy.get('#passenger-form').submit();
      cy.get('#results').should('contain.text', 'Did not survive'); 
    });
  });
  