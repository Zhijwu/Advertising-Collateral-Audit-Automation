//抓取整個機器人output的資料
var result_text = localStorage.getItem('result123');
console.log(result_text)


//轉jason為字串文字
var dic_Obj = JSON.parse(result_text);
console.log(dic_Obj)

//移除空格/上下引號
var imkeyword = dic_Obj.page3_keyword;

function removeChineseQuotes(imkeyword) {
    if (typeof imkeyword !== 'string') {
        console.error('The provided keyword is not a string:', imkeyword);
        return imkeyword;
    }
    // 使用正則表達式去除开始和結束的中文引號「」
    return imkeyword.replace(/「|」|\s/g, '');
}


//移除多餘的
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');  // $& 表示匹配的整个字符串
}



//把機器人給的關鍵字移除上下引號
var cleanedKeywords = dic_Obj.page3_keyword.map(removeChineseQuotes);
console.log(cleanedKeywords);


//抓元素值
var fileName = localStorage.getItem('fileName');
var fileContent = localStorage.getItem('fileContent');
var imfilename = JSON.parse(fileName);
var imfilecontent = JSON.parse(fileContent);

var filenameElement = document.getElementById('filename');  // 注意這裡是小寫的 'filename'
filenameElement.textContent = imfilename;

var filecontentElement = document.getElementById('filecontent');  // 注意這裡是小寫的 'filecontent'

// 獲取filecontentElement的文本内容
var content = imfilecontent;
// 使用正表達式去除所有的空格、換行符、制表符
content = content.replace(/\s+/g, '');
// 將處理後的内容重新設置到filecontentElement
filecontentElement.textContent = content;


//跑關鍵字[]，在文本上標黃底
if (cleanedKeywords && Array.isArray(cleanedKeywords)) {
    var originalText = filecontentElement.textContent;

    cleanedKeywords.forEach(function(keyword) {
        if (keyword === "無") {
            return; // 如果關鍵字是 "無"，直接跳過當前迭代
        }
        // 使用正則表達式查找和替換文本，使關鍵字突出顯示
        var escapedKeyword = escapeRegExp(keyword);
        var regex = new RegExp(escapedKeyword, 'gi');
        originalText = originalText.replace(regex, function(matched) {
            return '<span class="highlighted" onclick="showOutput(event)">' + matched + '</span>';
        });
    });

    // 將更新後的HTML内容賦值给textContent元素
    filecontentElement.innerHTML = originalText;
}

//抓result123 page4text[]字典(陣列)
var imdic_p4 = dic_Obj.page4_text;
let copy_imdic_p4 = imdic_p4.map(item => [...item]); // Deep copy of the array of arrays

console.log(imdic_p4);

var container = document.getElementById('container');

// 判斷 dic_Obj.page3_checklist 是否存在並且是數組
if (dic_Obj.page3_checklist && Array.isArray(dic_Obj.page3_checklist) && 
    dic_Obj.page3_reason && Array.isArray(dic_Obj.page3_reason) &&
    dic_Obj.page3_checklist.length === dic_Obj.page3_reason.length) {

        dic_Obj.page3_checklist.forEach(function(currentitem, index) {

        // 創建一个新的div元素(內包括Q/A/keywords)
        var newDiv = document.createElement('div');
        newDiv.id = 'div_' + index;
        newDiv.style.width = '600px';
        newDiv.style.height = 'auto';
        newDiv.style.marginTop = '15px'
        newDiv.style.marginLeft = '20px';
        newDiv.style.backgroundColor = '#FFF';
        newDiv.style.border = '1px solid #000';


        // Question Div
        var questionDiv = document.createElement('div');
        questionDiv.style.padding = '10px';
        questionDiv.style.backgroundColor = '#dde3e1';
        questionDiv.style.color = '	#006030';
        questionDiv.title = "不符合規定之題目";


        var Question = document.createElement('n');
        Question.textContent = currentitem;
        questionDiv.appendChild(Question);

        newDiv.appendChild(questionDiv);


        // Reason Div
        var reasonDiv = document.createElement('div');
        reasonDiv.style.padding = '10px';
        reasonDiv.style.backgroundColor = '#f5f5f5';
        reasonDiv.style.color = '#FF5809';
        reasonDiv.title = "不符合規定之原因";

        var Reason = document.createElement('n');
        Reason.textContent = dic_Obj.page3_reason[index];
        reasonDiv.appendChild(Reason);

        newDiv.appendChild(reasonDiv);


        //Keyword Div
        var imdic = dic_Obj.page3_dic;
        var keywordDiv = document.createElement('div');
        keywordDiv.style.padding = '10px';
        keywordDiv.style.backgroundColor = '#e6e6e6';
        keywordDiv.title = "不符合規定之字詞";

        var prefix = currentitem.match(/^[^\s.]+/);
        if (prefix) {
            prefix = prefix[0];
        }
        // 去除前缀部分，得到清理后的内容
        var cleanedItem = currentitem.replace(/^[^\s.]+[.\s]*/, '').trim();

        var Keyword = document.createElement('p');
        Keyword.id = 'keyword_' + index;
        var keywordsForThisItem = imdic[cleanedItem];
        console.log(currentitem)
        console.log(cleanedItem);
        console.log(keywordsForThisItem);

        //console.log("Prefix:", prefix); // 輸出前綴
        //console.log("Cleaned Item:", cleanedItem); // 輸出清理後的內容
        //console.log("Content:", content); // 輸出對應內容

        if (keywordsForThisItem && keywordsForThisItem.length > 0) {
            Keyword.textContent = keywordsForThisItem.join(', '); 
            keywordDiv.appendChild(Keyword);
            newDiv.appendChild(keywordDiv);
        }

        // 新增 Ignore Div 並添加勾選框
        var ignoreDiv = document.createElement('div');
        ignoreDiv.style.padding = '10px';
        ignoreDiv.style.color = 'gray'
        ignoreDiv.title = "您可以在此選擇忽略有問題的字詞，但是結果請自行承擔。:D";

        var cleanedKeywordsList = keywordsForThisItem.map(function(keyword) {
            return keyword.replace(/[「」\s]/g, '');
        });
        var ignoreCheckbox = document.createElement('input');
        ignoreCheckbox.type = 'checkbox';
        ignoreCheckbox.className = 'ignore-checkbox';  // 添加class以便後續選擇

        var ignoreLabel = document.createElement('label');  // 創建 label 元素
        ignoreLabel.textContent = '忽略此問題';
        ignoreLabel.style.color = 'gray';  // 初始化文字顏色

        console.log("Setting data-keyword with value:", cleanedKeywordsList.join(","));
        ignoreCheckbox.setAttribute('data-keyword', cleanedKeywordsList.join(","));

        
        ignoreCheckbox.addEventListener('change', function(event) {
            var keywordString = event.target.getAttribute('data-keyword');
            var keywords = keywordString.split(",");
            var label = event.target.nextElementSibling; // 獲取 checkbox 相鄰的 label 元素

            let findIndexInArray = function(currentitem) {
                return imdic_p4.findIndex(item => item[0] === currentitem); //用題目找到對應的index
            };
        
            if (event.target.checked) {
                keywords.forEach(function(keyword) {
                    removeHighlight(keyword);  // 確保有定義這個函數
                    let index = findIndexInArray(currentitem);
                    imdic_p4[index][1] = "是";
                    console.error();
                });
                label.style.color = 'red';
            } else {
                // 如果取消勾選，添加黃底
                keywords.forEach(function(keyword) {
                    highlightText(keyword);  // 確保有定義這個函數
                    let index = findIndexInArray(currentitem);
                    imdic_p4[index][1] = copy_imdic_p4[index][1];
                    console.error();
                });
                label.style.color = 'gray';
            }
            // 將imdic_p4存儲到localStorage
           localStorage.setItem('imdic_p4_data', JSON.stringify(imdic_p4));
    })
    
            ignoreDiv.appendChild(ignoreCheckbox);
            ignoreDiv.appendChild(ignoreLabel);
            newDiv.appendChild(ignoreDiv);

            // 將新創建的div元素添加到容器中
            container.appendChild(newDiv);
            });
    } else {
    console.log("page3_checklist 不是一個有效的數組");
}

// 假設每一個與關鍵字相關的div都有一個"data-keyword"屬性，值為該關鍵字
// <div data-keyword="keyword1"> ... </div>



var showall_btn = document.getElementById('showall_btn');
showall_btn.onclick = function(){
    var divs = document.querySelectorAll('div:not([style*="display: flex"])');  // 選取除了設置了flex布局的div以外的所有div
    divs.forEach(function(div) {
        div.style.display = 'block';  // 顯示這些div
    })
}


function removeAllHighlights() {
    var highlightedElements = document.querySelectorAll(".highlighted");
    highlightedElements.forEach(function(element) {
        var parent = element.parentNode;
        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
    });
}

function removeHighlight(keyword) {
    var textContainer = document.getElementById("filecontent");
    // 創建一個正則表達式來匹配highlighted的關鍵字
    var regex = new RegExp('<span class="highlighted" onclick="showOutput\\(event\\)">' + escapeRegExp(keyword) + '</span>', 'g');
    var text = textContainer.innerHTML.replace(regex, keyword);
    textContainer.innerHTML = text;
}


//錯誤地方反黃底
function highlightText(keyword) {
    var textContainer = document.getElementById("filecontent");
    var text = textContainer.innerHTML;
    var regex = new RegExp(escapeRegExp(keyword), 'g');
    text = text.replace(regex, function(matched) {
        return '<span class="highlighted" onclick="showOutput(event)">' + matched + '</span>';
    });
    textContainer.innerHTML = text;
}

function hasHighlightedText() {
    var textContainer = document.getElementById("filecontent");
    var highlightedElements = textContainer.querySelectorAll('.highlighted');
    return highlightedElements.length > 0;
}


function normalizeKeyword(clickedKeyword) {
    // 移除標點符號、空白符和特定的符號
    return clickedKeyword.replace(/[\s、“”"']+/g, "");
}


function showOutput(event) {
    // 清理字符串的函數
    function cleanString(str) {
        return str.replace(/[\s,]/g, '');  
    }

    // 獲取點擊的關鍵字並正規化
    var clickedKeyword = normalizeKeyword(event.target.textContent);
    console.log("Clicked:", clickedKeyword);
    
    // 獲取所有的 newDiv 元素
    var newDivs = document.querySelectorAll("[id^='div_']");

     // 遍歷 newDiv 元素，判斷是否需要顯示
     newDivs.forEach(function(newDiv) {
        //var keywordSpan = newDiv.querySelector("p"); // 獲取關鍵字的 p 元素
        //var keywordsForThisItem = keywordSpan.textContent;

        var keywordSpan = newDiv.querySelector("p"); // 獲取關鍵字的 p 元素
        if (!keywordSpan) {
            console.error("No keywordSpan found for", newDiv.id);
            return;
        }
        var keywordsForThisItem = keywordSpan.textContent;

        // 移除中文符號和空格，保留字母、數字、逗號和減號
        // 移除中文的雙引號「」
        var cleanedKeywords = keywordsForThisItem.replace(/[「」]/g, '');
        var keywordsList = cleanedKeywords.split(',');

        var isMatch = false;
        for (let i = 0; i < keywordsList.length; i++) {
            if (cleanString(keywordsList[i]) === clickedKeyword) {
                isMatch = true;
                break;
            }
        }
        console.log("Comparing:", clickedKeyword, "with", keywordsForThisItem);
        

          // 檢查是否匹配到關鍵字
        if (isMatch) {
            console.log(newDiv.id + " matched!");
            newDiv.style.display = 'block';
        } else {
            newDiv.style.display = 'none';
        }
     })
}

/*
change_btn.onclick = function(){
    if(hasHighlightedText()){
        alert('還有反黃底的部分')
    } else {
        if (confirm("確定要生成報告嗎?")){
            window.location.href = "checklist_table.html?";
        }else {
             alert("您已取消操作");
        }
    }
}
*/
change_btn.onclick = function(){
    if (confirm("確定要生成報告嗎?")){
        window.location.href = "checklist_table.html?";
    }else {
         alert("您已取消操作");
    }
}