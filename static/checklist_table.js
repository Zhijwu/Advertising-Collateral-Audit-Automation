var result_text = localStorage.getItem('imdic_p4_data');
var text_Obj = JSON.parse(result_text);


// 選擇所有帶有 'target-column' 類別的 <td> 元素
var cells = document.querySelectorAll('.target-column');

var lengthToIterate = Math.min(text_Obj.length, cells.length);

for (var i = 0; i < lengthToIterate; i++) {
    var htmlText = text_Obj[i][1].replace(/\n/, "<br>字詞: ").replace(/\n/, "<br>原因: ");
    cells[i].innerHTML = "<span class='filled-checkbox'></span>" + htmlText;
}