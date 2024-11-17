import pytest
from httpx import AsyncClient
from unittest.mock import patch, MagicMock
import pandas as pd
from main import app, processDataToDataFrame, getModel

# Mock data for testing
mock_data = {
    "title": "Master",
    "pclass": "1",
    "sex": "male",
    "age": 30,
    "fare": 22,
    "alone": "true",
    "embarked": "C",
    "selectedModels": ["randomForest"]
}

# Unit test for processDataToDataFrame
def test_process_data_to_data_frame():
    processed_df = processDataToDataFrame(mock_data)
    expected_df = pd.DataFrame(
        {
            "Pclass": [1],
            "Sex": [0],
            "Age": [30],
            "Fare": [22],
            "Embarked": [1],
            "Title": [4],
            "IsAlone": [1],
            "Age*Class": [30],
        }
    )
    pd.testing.assert_frame_equal(processed_df, expected_df)

# Unit test for getModel
@patch("main.loadModel")
def test_get_model(mock_load_model):
    model_name = "randomForest"
    mock_model = "mocked_model"
    mock_load_model.return_value = mock_model
    assert getModel(model_name) == mock_model
    assert getModel(model_name) == mock_model

# Integration test for /getPrediction endpoint
@pytest.mark.asyncio
@patch("main.getModel")
async def test_get_prediction(mock_get_model):
    mock_model = MagicMock()
    mock_model.predict.return_value = [1]
    mock_get_model.return_value = mock_model

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/getPrediction", json=mock_data)
    assert response.status_code == 200
    assert "randomForest" in response.json()
    assert response.json()["randomForest"] == "1"

if __name__ == "__main__":
    pytest.main()
