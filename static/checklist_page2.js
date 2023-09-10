var result_text = localStorage.getItem('result123');
console.log(result_text)

var dic_Obj = JSON.parse(result_text);
console.log(dic_Obj)

//取出該類別 "否" & "不適用" 的數量
var dic1 = dic_Obj.retrieve_dic["一、消費法規之遵循"]
var dic2 = dic_Obj.retrieve_dic["二、行銷廣告"]
var dic3 = dic_Obj.retrieve_dic["六、法令覆核"]
var dic7 = dic_Obj.retrieve_dic["七、信託業務行銷廣告"]

var W1 = document.getElementById("wrong1");
var W2 = document.getElementById("wrong2");
var W3 = document.getElementById("wrong3");
var W4 = document.getElementById("wrong4");

W1.innerHTML = dic1["否"];
W2.innerHTML = dic2["否"];
W3.innerHTML = dic3["否"];
W4.innerHTML = dic7["否"];

var N1 = document.getElementById("nofit1");
var N2 = document.getElementById("nofit2");
var N3 = document.getElementById("nofit3");
var N4 = document.getElementById("nofit4");

N1.innerHTML = dic1["不適用"];
N2.innerHTML = dic2["不適用"];
N3.innerHTML = dic3["不適用"];
N4.innerHTML = dic7["不適用"];



var change_btn = document.getElementById('change_btn');
var detail_btn = document.getElementById('detail_btn');


/*
change_btn.onclick = function(){
    // 你可以在這裡插入你想要執行的換頁邏輯，例如跳轉到另一個URL：
    if (confirm("確定要換頁嗎?")){
        window.location.href = "table.html?";
    }else {
         alert("您已取消操作");
    }
}
*/
detail_btn.onclick = function(){
    // 你可以在這裡插入你想要執行的換頁邏輯，例如跳轉到另一個URL：
    if (confirm("確定要換頁嗎?")){
        window.location.href = "checklist_detail.html";
        console.error();
    }else {
         alert("您已取消操作");
         return;
    }
}

