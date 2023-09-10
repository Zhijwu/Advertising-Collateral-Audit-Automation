from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import demo
import os
import pymysql
import time

# 資料庫連接設定
db_settings = {
    "host": "your_localhost",  # 或其他主機名稱/IP地址
    "port": "your_port",  # MySQL默認端口
    "user": "your_name",
    "password": "your_password",
    "db": "checklist"
}

app = Flask(__name__)
CORS(app)


#獲取當前資料夾路徑
current_script_path = os.getcwd()
data_path = current_script_path + "\static" + "\data" + "\自評項目 - 低成本測試.csv"

#獲取資料庫資料
check_list, support_data, class_list, QN_list =demo.read_csv_file(data_path)

@app.route('/get_check_answer', methods=['POST'])
def process_input2():
    prompt = request.get_json()['check_inputtext']
    print("220行：", prompt)
    
    #整個結果
    output_list = demo.check_list_chain(prompt, check_list, support_data)
    print(output_list)
    #page2
    retrieve_dic = demo.retrieve_output_dic(class_list, output_list)
    print(retrieve_dic)

    #切割字串
    result_list, word_list, reason_list = demo.spilit_text(output_list)

    #page3、page4
    page3_reason_list = []
    page4_text_dic = {}
    page3_keyword_list = []   #切完為無序集合
    page3_check_list = []
    page3_dic = {}

    print(QN_list)
    for index, keyword in enumerate(word_list):
        if result_list[index] == "否":
            page3_keyword_list.extend(word_list[index].split("、"))
            page3_reason_list.append(reason_list[index])
            page3_check_list.append(QN_list[index] + check_list[index])
            page3_dic[check_list[index]] = keyword.split("、")
            page4_text_dic[QN_list[index] + check_list[index]] = result_list[index] + "\n" + word_list[index] + "\n" + reason_list[index]
        else:
            page4_text_dic[QN_list[index] + check_list[index]] = result_list[index]
    
            
    page4_text_dic = list(page4_text_dic.items())
       
    return jsonify({'response': output_list,
                    "retrieve_dic": retrieve_dic,
                    "page3_keyword": page3_keyword_list,
                    "page3_checklist": page3_check_list,
                    "page3_reason": page3_reason_list,
                    "page3_dic":page3_dic,
                    "page4_text": page4_text_dic
                })


@app.route('/')
def checklist_index():
    return render_template('checklist_index.html')

@app.route('/checklist_page2.html')
def checklist_page2():
    return render_template('checklist_page2.html')

@app.route('/checklist_detail.html')
def detail():
    return render_template('checklist_detail.html')

@app.route('/checklist_table.html')
def checklist_table():
    return render_template('checklist_table.html')


def number_to_chinese(num):
    # 單位的中文數字
    chinese_numerals = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    
    if 1 <= num <= 10:
        return chinese_numerals[num]
    # ***若預期超過十個類別，需要擴充這個功能***


#讀類別+題目
@app.route("/my-new-route")
def index():

    # 建立連接
    connection = pymysql.connect(charset='utf8mb4', **db_settings)
    cursor = connection.cursor()


    # 首先從類別表中獲取所有的大標題
    cursor.execute("""
    SELECT * FROM category
    ORDER BY
    CASE 
        WHEN category_num = '一' THEN 1
        WHEN category_num = '二' THEN 2
        WHEN category_num = '三' THEN 3
        WHEN category_num = '四' THEN 4
        WHEN category_num = '五' THEN 5
        WHEN category_num = '六' THEN 6
        WHEN category_num = '七' THEN 7
        WHEN category_num = '八' THEN 8
        WHEN category_num = '九' THEN 9
        WHEN category_num = '十' THEN 10
        ELSE 9999
    END
    """)
    category = cursor.fetchall()
    
    
    html_rows = ""
    
    for imcategory in category:
        category_num, category_name = imcategory

         # 增加大標題的行
        html_rows += f'''
        <tr class="title_tr" id="category{category_num}">
        <td></td>
        <td class="title_text">{category_num}、{category_name}</td>
        <td></td>
        <td></td>
        <td></td>
        </tr>
        '''
        
        # 接著獲取此大標題下的所有小標題
        cursor.execute("""SELECT id_question, question, question_num FROM question 
                       WHERE category_num = %s
                       ORDER BY id_question""", (category_num,))
        question = cursor.fetchall()
        
        for imquestion in question:
            
            id_question, question, question_num = imquestion
            data_question_value = f'{category_num}|{question_num}'
            
            html_rows += f'''
             <tr data-id="{id_question}">
                <td style="width: 50px; text-align: center;">
                    <a href="#" class="edit_link">編輯</a>
                </td>
                <td>{question_num}.{question}</td>
                <td>
                    <input type="checkbox" class="yesCheckbox">是
                    <input type="checkbox" class="sourceCheckbox" disabled>依指定來源
                </td>
                <td>
                    <input type="file" class="fileInput" disabled>
                </td>
                <td>
                    <button class="onepickButton" data-question="{data_question_value}">單題審核</button>
                </td>
            </tr>
        '''
            
    # 讀取類別選項供<select>使用
    categoriesInSelect = [(category_num, category_name) for category_num, category_name in category]
       

    # 使用render_template渲染您的模板並插入動態數據
    return render_template('onepick.html', html_rows=html_rows, categoriesInSelect=categoriesInSelect)



#單題
@app.route('/onepick', methods=['POST'])
def onepick():
    try:
        # 建立連接
        connection = pymysql.connect(charset='utf8mb4', **db_settings)
        cursor = connection.cursor()
        
         # 获取传递来的数据
        data = request.get_json()
        big_title = data['big_title']
        small_title = data['small_title']
        fileContent = data['fileContent']  # 这里就是文件的内容
        print(fileContent)  # 打印文件内容

        if fileContent:
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            
            # 將fileContent儲存到指定路徑（假設您還想儲存文件的話）
            file_path = os.path.join("uploads", str(time.time()) + ".txt")  # 使用時間戳確保文件名稱獨特
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(fileContent)
            
            example_prompt = """
            你是法令遵循部的小助手，先幫我抓錯字，再幫我判斷文本是否適用我提供的規範，如果不適用就說「不適用」; 如果適用且符合規範就說「是」，不符合就說「否」，並且所有錯誤或模糊接近錯誤都列出，請針對指定的規範作回應，不相關則不要做回應(不要糾正日期格式)。
            
            規範: {rule}
            以繁體中文依照以下格式輸出，只要答案就好，絕對不要額外補充說明：
            ---
            是否符合規定：是/否/不適用
            不符合字詞或敘述：錯誤
            不符合的原因：錯誤會造成什麼後果 50個字上限
            ---
            以下是廣告文本：
            {fileContent}
            ---
            規範補充資料:
            {additional_inf}
            ---
            規範: {rule}
            以繁體中文依照以下格式輸出，只要答案就好，絕對不要額外補充說明：
            ---
            是否符合規定：是/否/不適用
            不符合字詞或敘述：錯誤
            不符合的原因：錯誤會造成什麼後果 50個字上限
            ---  
            """
                
            cursor.execute("""SELECT question, ad_inf FROM question 
                        WHERE category_num = %s AND question_num = %s""", 
                        (big_title, small_title))
            
            
            onepick_question = cursor.fetchall()
            question, ad_inf = onepick_question[0]
            print(f"題目: {question}, 補充資料: {ad_inf}")
            
            onepick_result = demo.onepick_answer(example_prompt.format(rule=question, fileContent=fileContent, additional_inf=ad_inf), question, ad_inf)
            connection.close()  # 關閉資料庫連接
            cursor.close()  # 關閉cursor
            return jsonify({'response': onepick_result})
            
        
    except Exception as e:
        print(f"Error: {str(e)}")  # 打印具體的異常訊息
        return jsonify({'error': 'An error occurred'}), 500


#寫類別進資料庫
@app.route("/add-category", methods=['POST'])
def add_category():
    new_category = request.form.get('category_name')

    # 建立連接
    connection = pymysql.connect(charset='utf8mb4', **db_settings)
    cursor = connection.cursor()

    # 查詢現有的類別數量
    cursor.execute("SELECT COUNT(*) FROM category")
    current_count = cursor.fetchone()[0]

     # 生成新的"大標題題號"
    new_category_num = number_to_chinese(current_count + 1)


    # 這裡只是簡單地插入一個新類別，實際操作可能需要更多的考慮
    cursor.execute("INSERT INTO category (category_num, category_name) VALUES (%s, %s)", (new_category_num, new_category,))
    connection.commit()
    return jsonify(status="success")


@app.route('/update_question', methods=['POST'])
def update_question():
    id_question = request.form.get('id_question')
    new_question = request.form.get('new_question')


    # 建立連接
    connection = pymysql.connect(charset='utf8mb4', **db_settings)
    cursor = connection.cursor()

    
    cursor.execute("UPDATE question SET question = %s WHERE id_question = %s", (new_question, id_question))
    connection.commit()

    return jsonify(status='success')


@app.route('/delete_question', methods=['POST'])
def delete_question():
    id_question = request.form.get('id')

    # 建立連接
    connection = pymysql.connect(charset='utf8mb4', **db_settings)
    cursor = connection.cursor()

    try:
        cursor.execute('DELETE FROM question WHERE id_question = %s', (id_question,))
        connection.commit()
    except Exception as e:
        connection.rollback()  # 如果出現錯誤，回滾事務
        print(e)  # 打印錯誤到控制台，或者你也可以將其記錄到日志
        return jsonify(success=False, message="Database Error")

    finally:
        cursor.close()
        connection.close()

    return jsonify(success=True)



if __name__ == "__main__":
    app.run(debug=True)

 