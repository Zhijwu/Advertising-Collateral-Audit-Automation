window.onload = function() {
    var tempFileName = localStorage.getItem('tempFileName');
    var tempFileContent = localStorage.getItem('tempFileContent');

    if (tempFileName && tempFileContent) {
        var file = new Blob([tempFileContent], {type: "text/plain;charset=utf-8"});
        file.name = tempFileName;

        // Clear the temporary storage
        localStorage.removeItem('tempFileName');
        localStorage.removeItem('tempFileContent');

        // Call the upload function with the temp file
        uploadtxtFile(file);
    }
}

var uploadedtxtFiles = [];

//抓廣告文宣檔案
function uploadtxtFile(uploadedFile) {
    var fileInput = document.getElementById('textfileuploader');
    var file = uploadedFile || fileInput.files[0];
    if (file) {
        var foundExistingFile = false;

        for (var i = 0; i < uploadedtxtFiles.length; i++) {
            if (uploadedtxtFiles[i].name === file.name) {
                foundExistingFile = true;
                var overwrite = confirm('你的上傳紀錄裡有相同的檔案名稱，是否進行覆蓋?');
                if(overwrite){
                    //刪除現有的重複舊檔案
                    document.getElementById('txtfilelist').removeChild(document.getElementById('txtfilelist').children[i]);
                    uploadedtxtFiles.splice(i, 1);
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileContent = event.target.result;
                        var txtfileId = uploadedtxtFiles.length;
                        uploadedtxtFiles.push({ name: file.name, content: fileContent });
                        var uploadedFileNames = uploadedtxtFiles.map(fileObj => fileObj.name);
                        localStorage.setItem('uploadedtxtFileNames', JSON.stringify(uploadedFileNames));
                        var txtfilelist = document.getElementById('txtfilelist');
                        var listItem = document.createElement('div');
                        listItem.className = "file-item"; // 为每个文件项添加一个类
                        listItem.id = "txtfile-" + txtfileId; // 添加这一行
                        listItem.onclick = () => showContent1(txtfileId);
                        listItem.innerHTML = '<div class="imfilename"><span class="file-name clickable">' + file.name + '</span></div> <div class="btn-container"><button class="imbtn" onclick="deleteFile1(' + txtfileId + ')"><i class="fas fa-trash-alt"></i></button></div>';
                        txtfilelist.appendChild(listItem);
                        // 这里还可以添加将新文件添加到列表中的代码
                        };
                        reader.readAsText(file);
                        fileInput.value = ''; // Reset file input
                        return;
                    }else{
                        alert('檔名已存在，請選擇一個新的檔名。');
                        return;
                    }
                }
            }
            // 如果没有找到现有文件，则继续正常的上传过程
        if (!foundExistingFile) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var fileContent = event.target.result;
                var txtfileId = uploadedtxtFiles.length;
                uploadedtxtFiles.push({ name: file.name, content: fileContent });
                var uploadedFileNames = uploadedtxtFiles.map(fileObj => fileObj.name);
                localStorage.setItem('uploadedtxtFileNames', JSON.stringify(uploadedFileNames));
                var txtfilelist = document.getElementById('txtfilelist');
                var listItem = document.createElement('div');
                listItem.className = "file-item"; // 为每个文件项添加一个类
                listItem.id = "txtfile-" + txtfileId; // 添加这一行
                listItem.onclick = () => showContent1(txtfileId);
                listItem.innerHTML = '<div class="imfilename"><span class="file-name clickable">' + file.name + '</span></div> <div class="btn-container"><button class="imbtn" onclick="deleteFile1(' + txtfileId + ')"><i class="fas fa-trash-alt"></i></button></div>';
                txtfilelist.appendChild(listItem);
            };
            reader.readAsText(file);
            fileInput.value = ''; // Reset file input
        }
    }
}

var uploadedinformFiles = [];

//抓佐證資料
function uploadinformFile() {
    var fileInput = document.getElementById('informfileuploader'); // 从ID获取input元素
    var file = fileInput.files[0]; // 获取所选文件
    if (file) {
        var foundExistingFile = false;

        for (var i = 0; i < uploadedinformFiles.length; i++) {
            if (uploadedinformFiles[i].name === file.name) {
                foundExistingFile = true;
                var overwrite = confirm('你的上傳紀錄裡有相同的檔案名稱，是否進行覆蓋?');
                if(overwrite){
                    //刪除現有的重複舊檔案
                    document.getElementById('informfilelist').removeChild(document.getElementById('informfilelist').children[i]);
                    uploadedinformFiles.splice(i, 1);
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileContent = event.target.result; // 获取文件内容
                        var informfileId = uploadedinformFiles.length; // 获取新文件ID
                        uploadedinformFiles.push({ name: file.name, content: fileContent }); // 将文件名和内容添加到数组
                        var uploadedFileNames = uploadedinformFiles.map(fileObj => fileObj.name);
                        localStorage.setItem('uploadedinformFileNames', JSON.stringify(uploadedFileNames));
                        var informfilelist = document.getElementById('informfilelist'); // 从ID获取文件列表元素
                        var listItem = document.createElement('div'); // 创建新的div元素
                        listItem.className = "file-item"; // 为每个文件项添加一个类
                        listItem.id = "informfile-" + informfileId; // 添加这一行
                        listItem.onclick =  () => showContent2(informfileId);
                        listItem.innerHTML = '<div class="imfilename"><span class="file-name clickable">' + file.name + '</span></div> <div class="btn-container"><button class="imbtn" onclick="deleteFile2(' + informfileId + ')"><i class="fas fa-trash-alt"></i></button></div>';
                        informfilelist.appendChild(listItem); // 将新元素添加到列表中
                        var listItem = document.createElement('div');
                        };
                        reader.readAsText(file);
                        fileInput.value = ''; // Reset file input
                        return;
                    }else{
                        alert('檔名已存在，請選擇一個新的檔名。');
                        return;
                    }
                }
            }
        if(!foundExistingFile){
            var reader = new FileReader(); // 创建文件阅读器
            reader.onload = function (event) {
                var fileContent = event.target.result; // 获取文件内容
                var informfileId = uploadedinformFiles.length; // 获取新文件ID
                uploadedinformFiles.push({ name: file.name, content: fileContent }); // 将文件名和内容添加到数组
                var uploadedFileNames = uploadedinformFiles.map(fileObj => fileObj.name);
                localStorage.setItem('uploadedinformFileNames', JSON.stringify(uploadedFileNames));
                var informfilelist = document.getElementById('informfilelist'); // 从ID获取文件列表元素
                var listItem = document.createElement('div'); // 创建新的div元素
                listItem.className = "file-item"; // 为每个文件项添加一个类
                listItem.onclick = () => showContent2(informfileId);
                listItem.id = "informfile-" + informfileId; // 添加这一行
                listItem.innerHTML = '<div class="imfilename"><span class="file-name clickable">' + file.name + '</span></div> <div class="btn-container"><button class="imbtn" onclick="deleteFile2(' + informfileId + ')"><i class="fas fa-trash-alt"></i></button></div>';
                informfilelist.appendChild(listItem); // 将新元素添加到列表中
            };
            reader.readAsText(file); // 读取文件内容
            fileInput.value = ''; // 重置文件输入，以便于再次选择相同文件
        }
    }
}
var previouslySelectedtxtFile;
var previouslySelectedinformFile;

function showContent1(txtfileId) {
    if (!uploadedtxtFiles[txtfileId]) {
        console.error('File with ID ' + txtfileId + ' not found');
        return;
    }

    if (previouslySelectedtxtFile) {
        previouslySelectedtxtFile.style.backgroundColor = ''; // 您可以将此设置为原始背景颜色
    }
    //抓值
    var txtfileContent = document.getElementById('imtxtfilecontent');
    txtfileContent.textContent = uploadedtxtFiles[txtfileId].content;
    //處理顏色外觀
    var fileElement = document.getElementById('txtfile-' + txtfileId);
    fileElement.style.backgroundColor = '#cdd8d4';

    previouslySelectedtxtFile = fileElement;
    localStorage.setItem('fileName', JSON.stringify(uploadedtxtFiles[txtfileId].name));
    localStorage.setItem('fileContent', JSON.stringify(uploadedtxtFiles[txtfileId].content));
}

function showContent2(informfileId) {
    if (!uploadedinformFiles[informfileId]) {
        console.error('File with ID ' + informfileId + ' not found');
        return;
    }

    if (previouslySelectedinformFile) {
        previouslySelectedinformFile.style.backgroundColor = ''; // 您可以将此设置为原始背景颜色
    }
    //抓值
    var informfilecontent = document.getElementById('iminformfilecontent');
    informfilecontent.textContent = uploadedinformFiles[informfileId].content;

    //處理顏色外觀
    var fileElement = document.getElementById('informfile-' + informfileId);
    fileElement.style.backgroundColor = '#cdd8d4';

    previouslySelectedinformFile = fileElement;
}

function deleteFile1(txtfileId) {
    var userConfirmed = confirm('您確定要刪除這個文件嗎？');
    if (!userConfirmed) {
        return; // 如果用戶選擇 "Cancel"，則退出函數，不進行刪除操作
    }
    var txtfilelist = document.getElementById('txtfilelist');
    txtfilelist.removeChild(txtfilelist.childNodes[txtfileId]);
    uploadedtxtFiles.splice(txtfileId, 1);

    // Update file IDs
    for (var i = txtfileId; i < txtfilelist.childNodes.length; i++) {
        txtfilelist.childNodes[i].id = "txtfile-" + i; // 更新ID
        txtfilelist.childNodes[i].onclick = () => showContent1(i); // 更新 onclick
        txtfilelist.childNodes[i].querySelector('.imbtn').setAttribute('onclick', 'deleteFile1(' + i + ')');
    }
}

function deleteFile2(informfileId) {
    var userConfirmed = confirm('您確定要刪除這個文件嗎？');
    if (!userConfirmed) {
        return; // 如果用戶選擇 "Cancel"，則退出函數，不進行刪除操作
    }
    var informfilelist = document.getElementById('informfilelist');
    informfilelist.removeChild(informfilelist.children[informfileId]);
    uploadedinformFiles.splice(informfileId, 1);

    // Update file IDs
    for (var i = informfileId; i < informfilelist.childNodes.length; i++) {
        informfilelist.childNodes[i].id = "informfile-" + i; // 更新ID
        informfilelist.childNodes[i].querySelector('.file-name').setAttribute('onclick', 'showContent2(' + i + ')');
        informfilelist.childNodes[i].querySelector('.imbtn').setAttribute('onclick', 'deleteFile2(' + i + ')');
    }
}

function changeColor(button) {
    button.classList.toggle('clicked');
    var btnFunc3 = document.getElementById('btnFunc3');
    var btnFunc2 = document.getElementById('btnFunc2');
    var btnFunc1 = document.getElementById('btnFunc1');

}

function generateRequestBody(prompt) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'check_inputtext': prompt })
    };
  }

function sendRequest(requestBody) {
    return fetch('/get_check_answer', requestBody)
        .then(response => response.json())
        .catch(error => console.error('Error during response processing:', error))
        .catch(error => console.error('Error during fetch:', error));
}

var checkbtn = document.getElementById('checkbtn');
checkbtn.onclick = function(){

    //組文本
    var imtxtfilecontent = document.getElementById('imtxtfilecontent').textContent;
    var iminformfilecontent = document.getElementById('iminformfilecontent').textContent;

    // 检查是否已选择文件
    if (!imtxtfilecontent.trim() || !iminformfilecontent.trim()) {
        alert('請先選取檔案');
        return; // 阻止后续代码执行
    }

    var modal = document.querySelector('.modal');
    modal.style.display = 'flex'; // 顯示模態窗口

    // 確定要換頁嗎？的部分
    if (!confirm('確定要換頁嗎？')) {
        modal.style.display = 'none';  // 如果點選取消，則將模態窗口隱藏
        alert('您已取消操作。');
        return; // 阻止後續代碼執行
    }

    var text = 
    `
    ${imtxtfilecontent} 
    佐證資料：
    ${iminformfilecontent}`;
    var prompt = 
    `
    你是法令遵循部的小助手，先幫我抓錯字，再幫我判斷文本是否適用我提供的規範，如果不適用就說「不適用」; 如果適用且符合規範就說「是」，不符合就說「否」，並且所有錯誤或模糊接近錯誤都列出，請針對指定的規範作回應，不相關則不要做回應，如果是日期格式錯誤則可以忽略。

    規範: {rule}。
    以繁體中文依照以下格式輸出，只要答案就好，絕對不要額外補充說明：
    ---
    是否符合規定：是/否/不適用
    不符合字詞或敘述：錯誤字詞
    不符合的原因：錯誤會造成什麼後果(50個字上限)
    ---
    以下是廣告文本：
    ${text}
    ---
    規範補充資料:
    {additional_inf}
    ---
    你是法令遵循部的小助手，先幫我抓錯字，再幫我判斷文本是否適用我提供的規範，如果不適用就說「不適用」; 如果適用且符合規範就說「是」，不符合就說「否」，並且所有錯誤或模糊接近錯誤都列出，請針對指定的規範作回應，不相關則不要做回應，如果是日期格式錯誤則可以忽略。
    規範: {rule}。
    請針對指定的規範作回應，不相關則不要做回應，務必忽略日期格式的錯誤。
    以繁體中文依照以下格式輸出，只要答案就好，絕對不要額外補充說明：

    是否符合規定：是/否/不適用
    不符合字詞或敘述：錯誤字詞
    不符合的原因：錯誤會造成什麼後果(50個字上限)
    `
    console.log(text)
    console.log(prompt)

    sendRequest(generateRequestBody(prompt))
    .then(result => {
    localStorage.setItem('result123', JSON.stringify(result));
    console.log(result);
    changePage();
    });
}

function changePage(){
    window.location.href ='checklist_page2.html'
}

var editbtn = document.getElementById('editbtn');
editbtn.onclick = function(){
    if(confirm('確定換頁嗎?')){
        window.location.href = "/my-new-route";
    }else{
        alert("您已取消操作");
        return;
    }
}