# Loan Payback Prediction (Kaggle Competition - Nov 2025)
## Playground Series - Season 5, Episode 11

This project builds machine learning models to predict the probability that a loan will be paid back. The dataset contains ~594k loan records with financial and demographic attributes.

## ⭐ Key Steps
- Exploratory data analysis and preprocessing
- Encoding categorical features
- Handling class imbalance using class weights
- Training multiple models:
  - Logistic Regression
  - Random Forest
  - XGBoost
  - LightGBM
  - CatBoost
- Hyperparameter tuning for LightGBM
- Generating probability-based predictions for Kaggle submission

## 📊 Best Model Performance
| Model | ROC-AUC |
|-------|---------|
| **LightGBM (tuned)** | **0.92085** |
| XGBoost | 0.91843 |
| CatBoost | 0.91681 |

Final Kaggle Public Score: **0.92211**  
Final Rank: **1515 / 3724**

## 📁 Repository Contents
- Jupyter Notebook (`Predicting_Loan_Payback.ipynb`)
- Preprocessing pipeline
- Model training & tuning script
- Final submission CSV
- Report / documentation

## 🚀 Techniques Used
- Gradient boosting models
- Hyperparameter tuning
- Label Encoding & Scikit-learn Pipelines
- Model evaluation with ROC-AUC

---

## 📎 Author
*Deepika Dohare*  


