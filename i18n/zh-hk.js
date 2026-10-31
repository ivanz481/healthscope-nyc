/* Hong Kong Cantonese localization, derived from Mandarin with HK vocabulary. */
(function(){
"use strict";
const from="与业两严个临为习于产仅从仪优会传伤体侧储儿关养内冲决况减击别务动劳势区医协单占卫历压参发变号后吗听员响嘱围国图块处复够头学实审对导将尔尘尽属岁岛峡师带帮并库应开异张强当录征忆态总惯户护报担择损换据携摄数断无时显暂术机杂来极构标栏样档检气汇沟没浅测浏点烟状独环现疗监盖码础确碍离种积筛简类紧约纽练细终绍经结统绪续维缓编缩网职联胆脏脑节范药获营虑螨规览计订认训议记许设访证评识诊话询详语误诱说请诺读调谢负败质资赖趋车载较辅边过运还这进远适选遗邮采针钠错键长问间阅阳际险韧项须顿预频题颜风饮验鲁齐龄", to="與業兩嚴個臨為習於產僅從儀優會傳傷體側儲兒關養內衝決況減擊別務動勞勢區醫協單佔衛歷壓參發變號後嗎聽員響囑圍國圖塊處復夠頭學實審對導將爾塵盡屬歲島峽師帶幫並庫應開異張強當錄徵憶態總慣戶護報擔擇損換據攜攝數斷無時顯暫術機雜來極構標欄樣檔檢氣匯溝沒淺測瀏點煙狀獨環現療監蓋碼礎確礙離種積篩簡類緊約紐練細終紹經結統緒續維緩編縮網職聯膽髒腦節範藥獲營慮蟎規覽計訂認訓議記許設訪證評識診話詢詳語誤誘說請諾讀調謝負敗質資賴趨車載較輔邊過運還這進遠適選遺郵採針鈉錯鍵長問間閱陽際險韌項須頓預頻題顏風飲驗魯齊齡";
const map=new Map([...from].map((c,i)=>[c,[...to][i]]));
const replaceTerms=[
 ["急診就診","急症室求診"],["急診服務","急症室服務"],["急診","急症室"],
 ["失智症","認知障礙症"],["阿爾茨海默病","阿茲海默症"],
 ["帕金森病","柏金遜症"],["亨廷頓病","亨廷頓舞蹈症"],
 ["美國疾控中心","美國疾病控制及預防中心"],
 ["紐約市衛生局","紐約市衛生及精神健康局"],
 ["衛生與心理衛生局","衞生及精神健康局"],
 ["公共衛生","公共衞生"],["衛生","衞生"],
 ["點擊","撳一下"],["點選","揀選"],["鼠標","滑鼠"],
 ["儀表板","數據面板"],["側邊欄","側邊選單"],
 ["疫苗接種","疫苗接種"],["信息","資訊"],
 ["醫療服務","醫療服務"],["官方數據","官方數據"],
 ["行動計劃","行動方案"],["郵政編碼","郵政編號"],
 ["更新狀態","更新情況"],["數據來源","資料來源"],
 ["數據概況","數據概覽"],["數據平台","數據平台"],
 ["新冠肺炎","新冠病毒感染"],["篩查","篩查"]
];
function convert(text){
 let translated=[...text].map(c=>map.get(c)||c).join("");
 for(const [a,b] of replaceTerms)translated=translated.split(a).join(b);
 return translated;
}
const zhCN=window.HS_ZH_CN||{};
const hk=Object.create(null);
for(const [key,value] of Object.entries(zhCN))hk[key]=convert(value);
Object.assign(hk,{
 "Language":"語言",
 "Monitor":"監察","Overview":"總覽","Citywide snapshot":"全市概況",
 "Surveillance":"疾病監測","Respiratory trends":"呼吸道疾病趨勢",
 "Vaccination":"疫苗接種","Coverage & guidance":"接種率及指引",
 "Emergency care":"急症服務","ED & response":"急症室及應急反應",
 "Chronic conditions":"長期病患","Long-term health burden":"長期健康負擔",
 "Neurodegenerative":"腦神經退化疾病","Brain & nerve disorders":"腦部及神經系統疾病",
 "Demographics":"人口資料","Population context":"人口健康背景",
 "Geography":"地區分析","Borough & neighborhood":"行政區及社區",
 "Data quality":"數據質素","Sources & freshness":"數據來源及更新情況",
 "Respiratory ED Visit Trend":"呼吸道疾病急症室求診趨勢",
 "Respiratory illness share of ED visits":"呼吸道疾病佔急症室求診比例",
 "COVID-19 share of ED visits":"新冠病毒感染佔急症室求診比例",
 "Flu share of ED visits":"流感佔急症室求診比例",
 "Emergency response":"緊急應變","Emergency Care":"緊急醫療服務",
 "Respiratory Surveillance":"呼吸道疾病監測",
 "Borough":"行政區","Response time":"應變時間","Response time*":"應變時間*",
 "Emergency response time":"緊急應變時間",
 "Life-Threatening Medical Emergency Response":"危及生命的醫療事故應急反應",
 "Data pipeline":"數據更新程序","Healthy":"運作正常",
 "Time window":"時間範圍","Latest":"最新","All available":"所有可用數據",
 "Map indicator":"地圖指標","Download current CSV":"下載現有 CSV",
 "Refresh sources":"更新資料來源","Source":"資料來源",
 "Click a borough to explore":"揀選行政區以查看更多資料",
 "What happens if a source fails?":"如果資料來源出現問題，會點樣處理？",
 "Can it be prevented?":"可以預防嗎？",
 "What is reasonable to do now?":"現階段可以做啲乜？",
 "What's it about?":"內容介紹",
 "Selected Laboratory Respiratory Panel":"呼吸道病毒化驗結果",
 "NYC children and adolescents vaccinated for flu":"紐約市已接種流感疫苗的兒童及青少年",
 "Respiratory Surveillance":"呼吸道疾病監測",
 "COVID-19 ED visits":"新冠病毒感染急症室求診",
 "Flu ED visits":"流感急症室求診",
 "RSV ED visits":"呼吸道合胞病毒急症室求診",
 "Overall respiratory ED visits":"整體呼吸道疾病急症室求診",
 "Current Virus Indicators":"最新病毒監測指標",
 "Healthcare":"醫療服務",
 "Healthscope NYC Overview":"Healthscope NYC 總覽",
 "Citywide Immunization Registry":"全市疫苗接種登記冊",
 "New York City public health intelligence":"紐約市公共衞生資訊平台",
 "Verified public sources":"已核實的公共數據來源",
 "At a glance":"一目了然",
 "Status":"狀態"
});
window.HS_ZH_HK=hk;
window.HS_HK_CONVERT=convert;
})();
