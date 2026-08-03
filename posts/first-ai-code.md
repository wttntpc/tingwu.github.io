在資料分析與研究過程中，我經常使用 Python 或 R 處理實驗資料。開始使用 AI 工具之後，我逐漸建立一套更有效率的工作方式：

1. **加速重複性資料處理**，把時間留給研究問題本身。
2. 遇到錯誤時，透過 AI 協助理解問題與測試修正方式。
3. 快速進入原本陌生的工具或框架，再逐步驗證產出的結果。

## 一個簡單的資料清理範例

```python
import pandas as pd

def clean_data(file_path):
    df = pd.read_csv(file_path)
    numeric = df.select_dtypes(include="number").columns
    df[numeric] = df[numeric].fillna(df[numeric].mean())
    return df.drop_duplicates()

cleaned_data = clean_data("experiment_results.csv")
print(cleaned_data.head())
```

AI 並不取代研究者的判斷。對我而言，它更像是一位能快速討論、協助整理與提出檢查方向的夥伴；資料品質、統計假設和研究倫理，仍需要由研究者負責。

未來我會在這裡持續分享 AI 如何進入我的研究與生活工作流。
