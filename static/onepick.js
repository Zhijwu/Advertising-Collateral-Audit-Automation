
$(document).ready(function() {
    $('#sourceCheckbox').attr('title', '你需要先選擇"是"');
})


$(document).ready(function() {
    $("#addCategoryBtn").click(function() {
        // 取得用戶輸入的新類別名稱
        var newCategoryName = $("#newCategoryName").val().trim();

        // 檢查是否有輸入名稱
        if (newCategoryName == "") {
            alert("請輸入類別名稱！");
            return;
        }

        // 使用AJAX向後端發送請求，保存新類別
        $.ajax({
            type: "POST",
            url: "/add-category",
            data: {
                category_name: newCategoryName
            },
            success: function(response) {
                if (response.status == "success") {
                    location.reload();
                } else {
                    alert("添加類別失敗，請重試！");
                }
            },
            error: function() {
                alert("系統錯誤，請稍後再試！");
            }
        })
    })
})


// 定義新的類別模板
var newQuestionTemplate = `
<tr>
<td style="width: 50px; text-align: center;">
    <a href="#" class="edit_link">編輯</a>
</td>
<td>新的問題內容...</td>
<td>
    <input type="checkbox" class="yesCheckbox">是
    <input type="checkbox" class="sourceCheckbox" disabled>依指定來源
</td>
<td>
    <input type="file" disabled>
</td>
<td>test</td>
</tr>
`;

$(document).ready(function() {
    // 打開模态框
    $("#addQuestionBtn").click(function() {
        $("#categoryModal").show();
        $("#modalBackdrop").show();  // 顯示遮罩層
    });

    // 使用者點擊了關閉按鈕
    $("#closeModal").click(function() {
        $("#categoryModal").hide();
        $("#modalBackdrop").hide();  // 隱藏遮罩層
    });

    // 用户选择了类别并点击确认按钮
    $("#confirmCategory").click(function() {
        var selectedCategory = $("#categorySelect").val();
        var newQuestionContent = $("#newQuestionInput").val(); // 從輸入框中獲取新問題的文字

        if(!newQuestionContent) { // 如果問題內容是空的
            alert("請輸入題目!"); // 彈出警告
            return; // 不進行後續操作
        }

        console.log("Selected category:", selectedCategory);
        console.log("New question:", newQuestionContent);

        var updatedTemplate = newQuestionTemplate.replace('新的問題內容...', newQuestionContent);

        // 找到相應的類別
        var targetCategoryRow = $("tr.title_tr").eq(selectedCategory);
        if(targetCategoryRow.length == 0) {
            console.error("No matching category found!"); // 如果找不到相應的類別，輸出錯誤
            return;
        }

        // 插入新問題到這個類別之後
        targetCategoryRow.after(updatedTemplate);
        
        $("#categoryModal").hide();
        $("#modalBackdrop").hide();  // 隱藏遮罩層
        $("#newQuestionInput").val(''); // 清空輸入框
    });
});

//寫如果選擇"是"，"依指定來源"才可被選
$(document).ready(function() {
    $('table').on('change', 'input[type="checkbox"]', function() {
        // 共用的變量
        var yesCheckbox = $(this).closest('td').find('.yesCheckbox');
        var sourceCheckbox = $(this).closest('td').find('.sourceCheckbox');
        var fileInput = $(this).closest('td').next('td').find('input[type="file"]');

        // 如果當前選中的是"是"的複選框
        if ($(this).is('.yesCheckbox')) {
            if (yesCheckbox.prop('checked')) {
                // 啟用"依指定來源"複選框
                sourceCheckbox.prop('disabled', false);
            }else {
                // 禁用並取消選中"依指定來源"複選框
                sourceCheckbox.prop('disabled', true).prop('checked', false);
                // 禁用文件上傳輸入
                fileInput.prop('disabled', true);
            }
        }

        // 如果當前選中的是"依指定來源"的複選框
        if ($(this).is('.sourceCheckbox')) {
            if (sourceCheckbox.prop('checked')) {
                // 啟用文件上傳輸入
                fileInput.prop('disabled', false);
            }else {
                // 禁用文件上傳輸入
                fileInput.prop('disabled', true);
            }
        }
    })
});


$(document).ready(function() {
    $("tbody").on("click", ".edit_link", function(e) {
        e.preventDefault();

        var $this = $(this);
        var $td = $this.closest('td');
        var $questionTd = $td.next();
        var originalText = $questionTd.text();

        if ($this.text() == "編輯") {
            // 将文字内容转为输入框
            $questionTd.html('<input type="text" class="question_input" value="' + originalText + '">');
            $this.text("完成");
            $td.prepend('<a href="#" class="delete_link">刪除|</a> ');
        } else if ($this.text() == "完成") {
            if(confirm('編輯完成？')){
                var text = $questionTd.find('.question_input').val();
                var newText = text.replace(/^\d+\./, '');  // 去掉所有數字
                var $tr = $this.closest('tr');
                var id_question = $tr.data('id'); 

                // AJAX 請求來更新伺服器資料
                $.ajax({
                    type: "POST",
                    url: "/update_question",  // 對應後端的路由
                    data: {
                        'id_question': id_question,
                        'new_question': newText
                    },
                    success: function(response) {
                        // handle response if necessary
                        if (response.status == 'success') {
                            $questionTd.text(newText);
                            $this.text("編輯");
                            $td.find('.delete_link').remove();
                        }
                    }
                })
            }else{
                return;
            }
        }
    });

    // 如果要實現刪除功能
     $("tbody").on('click', '.delete_link', function(e) {
        e.preventDefault();
        var isConfirmed = confirm("確認刪除?");

        // 如果用户点击了"确定"
        if (isConfirmed) {
            var $tr = $(this).closest('tr');

            // AJAX 請求來刪除伺服器上的資料
            $.ajax({
                type: "POST",
                url: "/delete_question", // 您的伺服器端點
                data: {
                    id: $tr.data('id')
                },
                success: function(response) {
                    $tr.remove();
                },
                error: function(error) {
                    // 處理錯誤回應，例如顯示錯誤消息
                }
            })
        }
    });
});

$(document).ready(function() {
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();  // 獲得當前滾動的位置

        // 如果回到頂部，則移除 sticky 類
        if (scrollTop === 0) {
            $('.title_tr').removeClass('sticky');
            return;
        }

        $('.title_tr').each(function(){
            var topDistance = $(this).offset().top;  // 獲得每個類別距離頁面頂部的距離

            if ((topDistance) < scrollTop) {  // 如果目前滾動的位置大於該類別的頂部位置
                $('.title_tr').removeClass('sticky');  // 先移除所有的 sticky class
                $(this).addClass('sticky');  // 然後將 sticky class 加到當前的類別上
            }
        })
    })
});

$(document).ready(function() {
    $("#footer").hover(function() {
        // 當滑鼠移到 footer 時，將其移至視窗底部
        $(this).css("bottom", "0");
    }, function() {
        // 當滑鼠離開 footer 時，將其部分隱藏
        $(this).css("bottom", "-130px");
    });
});


//單題審核
const onepickButtons = document.querySelectorAll('.onepickButton');

onepickButtons.forEach(button => {
    button.addEventListener('click', function() {
        const dataQuestionValue = this.getAttribute('data-question');
        
        // 分割 data-question 字符串并存储到两个变量中
        const [big_title, small_title] = dataQuestionValue.split('|');

        // 在这里可以使用这两个变量做你想要的处理
        console.log(`大標題：${big_title}`);
        console.log(`小標題：${small_title}`);

        const onepick = {
            big_title: big_title,
            small_title: small_title
        };

        // 從當前的 button 元素向上查找其所在的 <tr> 元素
        const trElement = this.closest('tr');
        // 從該 <tr> 元素中找到 .fileInput 元素
        const fileInputElement = trElement.querySelector('.fileInput');

        // 檢查是否有文件選擇
        if (fileInputElement.files.length > 0) {
            const file = fileInputElement.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                const fileContent = event.target.result;
                console.log(fileContent); // 这里打印文件内容

                const dataToSend = {
                    big_title: big_title,
                    small_title: small_title,
                    fileContent: fileContent
                };

                // 發送POST請求到後端伺服器
                fetch('/onepick', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(response => response.json())
                .then(response => {
                    // 格式化並更新到面板上
                    let formattedResponse = response.response.replace(/\n/g, '<br>'); // 用HTML的<br>替換換行符
                    let panel = document.getElementById("response-panel");
                    let close = document.getElementById("close-panel");
                    panel.innerHTML = formattedResponse;
                    panel.style.display = "block"; // 顯示面板
                    console.log(response);
                })
                .catch(error => {
                    console.error('錯誤', error);
                });
            }
            reader.readAsText(file); // 这里我们假设文件是文本文件
        }else{
            alert('請上傳檔案!');
        }
    });
});


// 在面板外面點擊的事件監聽器
document.addEventListener('click', function(event) {
    let panel = document.getElementById('response-panel');
    // 檢查被點擊的元素是否在面板內部
    if (!panel.contains(event.target) && event.target.id !== 'close-panel') {
        panel.style.display = 'none';
    }
});

// 保證面板自己被點擊時不會被隱藏
document.getElementById('response-panel').addEventListener('click', function(event) {
    event.stopPropagation();
});
