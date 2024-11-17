const defaultAge = 30;
const defaultFare = 22;
document.getElementById('age').value = defaultAge;
document.getElementById('fare').value = defaultFare;

const passengerForm = document.getElementById('passenger-form');
const modelForm = document.getElementById('model-form');
const resultsDiv = document.getElementById('results');
const historyDiv = document.getElementById('history-results');

function main() {
    const WE_ARE_STILL_TESTING = true;
    if (WE_ARE_STILL_TESTING) {
        //for testing set knn to toggled now 
        const knn = modelForm.elements['model'][2];
        knn.checked = true;
        change();
    }
    modelForm.addEventListener('change', change);
    passengerForm.addEventListener('change', change);
}

function change() {
    console.log("change");

    const title = document.getElementById('title').value;
    const pclass = document.getElementById('pclass').value;
    const sex = document.getElementById('sex').value;
    const ageElement = document.getElementById('age');
    const ageText = ageElement.value;
    let age;
    try {
        age = parseFloat(ageText);
    } catch (error) {
        age = defaultAge;
    }
    if (age > 100) {
        age = 100;
    }
    if (age < 0) {
        age = 0;
    }
    ageElement.value = age;

    console.log("age", age);

    const fareElement = document.getElementById('fare');
    const fareText = fareElement.value;

    let fare;
    try {
        fare = parseFloat(fareText);
    } catch (error) {
        fare = defaultFare;
    }
    if (fare > 500) {
        fare = 500;
    }
    if (fare < 0) {
        fare = 0;
    }
    fareElement.value = fare;

    const alone = document.getElementById('alone').value;
    const embarked = document.getElementById('embarked').value;

    const selectedModels = [];
    const checkboxes = modelForm.elements['model'];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedModels.push(checkboxes[i].value);
        }
    }

    if (selectedModels.length == 0) {
        resultsDiv.innerHTML = '';
        console.log("No model selected");
    } else {
        console.log("[Model selected]", selectedModels);

        const requestBodyJson = {
            "title": title,
            "pclass": pclass,
            "sex": sex,
            "age": age,
            "fare": fare,
            "alone": alone,
            "embarked": embarked,
            "selectedModels": selectedModels
        };
        sendJson(requestBodyJson);
    }
}

function sendJson(jsonToSend) {
    console.log("(Sending)", JSON.stringify(jsonToSend));

    fetch('http://localhost:5001/getPrediction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonToSend)
    })
        .then(response => response.json())
        .then(data => {
            console.log('(Success)', data);
            // resultsDiv.innerHTML = JSON.stringify(data);
            resultsDiv.innerHTML = '';
            for (const [key, value] of Object.entries(data)) {
                const prediction = value;
                let predictionText;
                if (prediction == 0) {
                    predictionText = "Did not survive";
                } else if (prediction == 1) {
                    predictionText = "Survived";
                } else {
                    predictionText = "GOT UNEXPECTED PREDICTION: " + prediction;
                }
                resultsDiv.innerHTML += `<p>${key}: ${predictionText}</p>`;
            }
            updateHistory(jsonToSend, data);

        })
        .catch(error => {
            console.error('Error:', error);
            resultsDiv.innerHTML = '';
            jsonToSend["selectedModels"].forEach(model => {
                resultsDiv.innerHTML += `<p>${model}: ${error}</p>`;
            });
            const dataFallback = {}
            jsonToSend["selectedModels"].forEach(model => {
                dataFallback[model] = error;
            });
            updateHistory(jsonToSend, dataFallback);
            
        });
}

const history = [];

function updateHistory(inputs, outputs) {
    const date = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    console.log(formattedDate);

    const historyItem = {"inputs": inputs, "outputs": outputs, "timestamp": formattedDate};
    history.push(historyItem);
    
    const the5Latestorlessiflessthan5 = history.slice(-5);
    //reverse
    the5Latestorlessiflessthan5.reverse(); 
    
    // historyDiv.innerHTML = '';
    // the5Latestorlessiflessthan5.forEach(historyItem => {
    //     const div = document.createElement('div');
    //     div.classList.add('history-item');
    //     div.innerHTML = `
    //         <p><strong>Inputs:</strong> ${JSON.stringify(historyItem.inputs)}</p>
    //         <p><strong>Outputs:</strong></p>
    //         <ul>
    //             ${Object.entries(historyItem.outputs).map(([key, value]) => {
    //         let predictionText = value == 0 ? "Did not survive" : (value == 1 ? "Survived" : `GOT UNEXPECTED PREDICTION: ${value}`);
    //         return `<li>${key}: ${predictionText}</li>`;
    //     }).join('')}
    //         </ul>
    //     `;
    //     historyDiv.appendChild(div);
// });

// add timestamp at top and index if from 1 to 5 and 

    historyDiv.innerHTML = '';
    the5Latestorlessiflessthan5.forEach((historyItem, index) => {
        const div = document.createElement('div');
        div.classList.add('history-item');
        div.innerHTML = `
            <p><strong>Timestamp:</strong> ${historyItem.timestamp}</p>
            <p><strong>Inputs:</strong> ${JSON.stringify(historyItem.inputs)}</p>
            <p><strong>Outputs:</strong></p>
            <ul>
                ${Object.entries(historyItem.outputs).map(([key, value]) => {
            let predictionText = value == 0 ? "Did not survive" : (value == 1 ? "Survived" : `GOT UNEXPECTED PREDICTION: ${value}`);
            return `<li>${key}: ${predictionText}</li>`;
        }).join('')}
            </ul>
        `;
        historyDiv.appendChild(div);
    });



    // const historyItem = document.createElement('div');
    // historyItem.classList.add('history-item');
    // historyItem.innerHTML = `
    //     <p><strong>Inputs:</strong> ${JSON.stringify(inputs)}</p>
    //     <p><strong>Outputs:</strong></p>
    //     <ul>
    //         ${Object.entries(outputs).map(([key, value]) => {
    //     let predictionText = value == 0 ? "Did not survive" : (value == 1 ? "Survived" : `GOT UNEXPECTED PREDICTION: ${value}`);
    //     return `<li>${key}: ${predictionText}</li>`;
    // }).join('')}
    //     </ul>
    // `;
    // historyDiv.appendChild(historyItem);
    



}

function resetCalculator() {
    passengerForm.reset();
    modelForm.reset();
    document.getElementById('age').value = defaultAge;
    document.getElementById('fare').value = defaultFare;
    resultsDiv.innerHTML = '';
}

main();
