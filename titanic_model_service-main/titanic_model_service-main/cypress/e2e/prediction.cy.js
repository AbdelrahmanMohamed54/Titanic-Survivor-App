// cypress/e2e/prediction.cy.js

describe('GET /getPrediction endpoint', () => {
    it('should return predictions from the selected models', () => {
      const requestData = {
        title: "Master",
        pclass: "1",
        sex: "male",
        age: 30,
        fare: 22,
        alone: "true",
        embarked: "C",
        selectedModels: ["randomForest"]
      };
  
      cy.request('POST', 'http://localhost:5001/getPrediction', requestData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('randomForest');
        expect(response.body.randomForest).to.eq("1");
      });
    });
  });
  