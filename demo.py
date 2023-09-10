import openai
from config import OPEN_API_KEY
import pandas as pd
import openai
import re
import nltk
nltk.download('punkt')
import re

# 設定api_key
openai.api_key = OPEN_API_KEY

#讀csv檔
def read_csv_file(url):
    data = pd.read_csv(url)
    data["補充資料"] = data["補充資料"].fillna("無")

    check_list = data["自評項目"].values.tolist()
    support_data = data["補充資料"].values.tolist()
    class_list = data["類別"].values.tolist()
    QN_list = data[data.columns[1]].values.tolist()
    return check_list, support_data, class_list, QN_list

#計算不符&不適合數量
def retrieve_output_dic(class_list, output_list):
    retrieve_dic = {}

    for i in class_list:
        retrieve_dic[i] = {"否":0, "不適用":0}
        
    for Class, output in zip(class_list, output_list):
        match = re.search(r"規定[：:](.+)\n", output)
        result = match.group(1).strip()
        if result == "否":
            retrieve_dic[Class]['否'] += 1
        elif result == "不適用":
            retrieve_dic[Class]['不適用'] += 1

    return  retrieve_dic

def spilit_text(output_list):
    ptn_result = re.compile(r"規定[：:](.+)\n")
    ptn_word = re.compile(r"敘述[：:](.+)\n")
    ptn_reason = re.compile(r"原因[：:](.+)")

    result_list = [ptn_result.search(i).group(1) for i in output_list]
    word_list = [ptn_word.search(i).group(1) for i in output_list]
    reason_list = [ptn_reason.search(i).group(1) for i in output_list]

    return result_list, word_list, reason_list


def check_list_chain(prompt, check_list: list, support_data: list):
    openai.api_key = OPEN_API_KEY

    output_list = []
    for rule, additional_inf in zip(check_list, support_data):
    
        prompt_text = prompt.format(rule=rule, additional_inf=additional_inf)

        message=[{"role": "user", "content": prompt_text}]
        response = openai.ChatCompletion.create(
            model="gpt-4-0613",
            messages = message,
            temperature=0.1,
            #max_tokens=1000,
            frequency_penalty=0.0
        )
        output = response["choices"][0]["message"]["content"]
        print("題目: " + rule + "\n" + output + "\n")
        output_list.append(output)

    result_list = [str(i) + "." + j for i ,j in enumerate(output_list)]  
    return result_list




def onepick_answer(prompt, rule: str, additional_inf: str):
    openai.api_key = OPEN_API_KEY

    prompt_text = prompt.format(rule=rule, additional_inf=additional_inf)

    message=[{"role": "user", "content": prompt_text}]
    response = openai.ChatCompletion.create(
        model="gpt-4-0613",
        messages = message,
        temperature=0.1,
        frequency_penalty=0.0
    )
    output = response["choices"][0]["message"]["content"]
    return output