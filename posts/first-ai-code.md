這是我第一篇分享 AI 與程式開發結合的文章。

在資料分析與研究過程中，我常常需要撰寫 Python 或 R 語言來處理實驗數據。自從開始使用 AI 工具（例如 ChatGPT, Claude 等）後，我發現：

1. **自動化處理資料**變得非常迅速。
2. 遇到 Bug 時，AI 可以幫助快速除錯。
3. 把原本不會的框架（例如這次的 React 網站開發），透過 AI 也能快速建立起來。

以下是一段我常用來處理資料的 Python 程式碼範例：

```python
import pandas as pd
import numpy as np

def clean_data(file_path):
    df = pd.read_csv(file_path)
    # 填補空值
    df.fillna(df.mean(), inplace=True)
    # 移除重複項目
    df.drop_duplicates(inplace=True)
    return df

cleaned_data = clean_data("experiment_results.csv")
print(cleaned_data.head())
```

未來我也會在這裡陸續分享我是如何把 AI 工作流導入我的日常研究與生活中。
