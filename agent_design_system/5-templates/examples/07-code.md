---
id: EX-07
type: demo
title: 코드 블록 · 인라인 코드
status: stable
version: 1.0.0
summary: 코드 앞에는 무엇을 하는 코드인지 한 문장, 뒤에는 실행 방법을 쓴 예시입니다.
template: 코드 튜토리얼형
elements: 코드 블록 · 인라인 코드 · 인용문
rules: [ANS-01, ANS-02, ANS-16, ANS-23, ANS-24]
figma: https://www.figma.com/design/PaiIhP9vY84N7i79wzJkAA/Agent-Design-System?node-id=274-1139
---
@user
CSV 파일에서 중복된 행만 지우고 싶어

@assistant
파이썬의 `pandas`를 쓰면 몇 줄로 끝나요.

아래 코드는 중복 행을 지운 뒤 새 파일로 저장합니다.

```python
import pandas as pd

df = pd.read_csv("orders.csv")
df = df.drop_duplicates()  # 모든 열이 같은 행 제거
df.to_csv("orders_clean.csv", index=False)
```

터미널에서 `python clean.py`로 실행하면 같은 폴더에 `orders_clean.csv`가 생겨요.

> 원본 파일을 덮어쓰지 않도록 저장할 파일 이름은 다르게 두세요.

@user
특정 열 기준으로만 중복을 보고 싶으면?

@assistant
`subset`에 기준 열을 넣으면 돼요. `keep`으로 남길 행도 고를 수 있어요.

```python
df = df.drop_duplicates(subset=["주문번호"], keep="last")
```

`keep="last"`는 가장 마지막에 나온 행을 남기고, 기본값인 `"first"`는 처음 나온 행을 남깁니다.
