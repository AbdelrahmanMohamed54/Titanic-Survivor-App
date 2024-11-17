from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

allModels = ["knn", "decisionTree", "logisticRegression", "randomForest", "svm"]
modelsLoaded = {}

TEST_ON_ACTUAL_MODELS = True

def getModel(modelName):
    modelNeedsToBeLoaded = modelName not in modelsLoaded
    if modelNeedsToBeLoaded:
        modelsLoaded[modelName] = loadModel(modelName)
    return modelsLoaded[modelName]

def loadModel(modelName):
    absPath = os.path.join("pickledModels", modelName + ".pkl")
    with open(absPath, "rb") as file:
        loadedModel = pickle.load(file)
    return loadedModel

@app.post("/getPrediction")
async def getPrediction(request: Request):
    data = await request.json()
    print(data)
    models = data["selectedModels"]
    predictions = {}
    for modelName in models:
        prediction = -1
        processedDataFrame = processDataToDataFrame(data)

        if TEST_ON_ACTUAL_MODELS:
            loadedModel = getModel(modelName)
            predictionList = loadedModel.predict(processedDataFrame)
            prediction = predictionList[0]

        predictions[modelName] = str(prediction)

    predictions = dict(sorted(predictions.items()))

    return JSONResponse(predictions)

def processDataToDataFrame(data):
    USE_EXAMPLE_FRONTEND_DATA = False

    if USE_EXAMPLE_FRONTEND_DATA:
        data = {"title": "Master", "pclass": "1", "sex": "male", "age": 30, "fare": 22, "alone": "true", "embarked": "C", "selectedModels": ["randomForest"]}

    pclass = data["pclass"]
    if pclass == "1":
        pclass = 1
    elif pclass == "2":
        pclass = 2
    else:
        pclass = 3

    sex = data["sex"]
    if sex == "male":
        sex = 0
    else:
        sex = 1

    age = data["age"]
    fare = data["fare"]

    embarked = data["embarked"]
    if embarked == "S":
        embarked = 0
    elif embarked == "C":
        embarked = 1
    else:
        embarked = 2

    title = data["title"]
    if title == "Master":
        title = 4
    elif title == "Miss":
        title = 2
    elif title == "Mrs":
        title = 3
    else:
        title = 1

    alone = data["alone"]
    if alone == "true":
        alone = 1
    else:
        alone = 0

    ageclass = age * pclass

    processedDataFrame = pd.DataFrame(
        {
            "Pclass": [pclass],
            "Sex": [sex],
            "Age": [age],
            "Fare": [fare],
            "Embarked": [embarked],
            "Title": [title],
            "IsAlone": [alone],
            "Age*Class": [ageclass],
        }
    )

    USE_PREDEFINED_DATAFRAME = False

    predefinedDataFrame = pd.DataFrame(
        {
            "Pclass": [3],
            "Sex": [0],
            "Age": [30],
            "Fare": [50],
            "Embarked": [2],
            "Title": [1],
            "IsAlone": [1],
            "Age*Class": [1],
        }
    )

    if USE_PREDEFINED_DATAFRAME:
        return predefinedDataFrame
    else:
        return processedDataFrame

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001, log_level="debug")
