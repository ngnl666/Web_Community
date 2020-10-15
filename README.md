# Graduation Project
這是個畢業專題:D
------------------------------------------------------------------------------
網址: [CONNECT](https://ngnl666.github.io/Web_Community/Web/index.html)

## 開發環境與使用套件
    ∙ 伺服器 : Google Cloud Platform (GCP)
    ∙ 資料庫 : MySQL
    ∙ 後端 : Node.js、PM2、Apache
    ∙ 前端 : HTML、CSS、JavaScript(jQuery)、Bootstrap

## GCP 伺服器
    ∙ 帳號 : daniel9563769@gmail.com
    ∙ 地區 : 台灣
    ∙ 地址 : no display
    ∙ 信用卡 : no display
    ∙ 建立時間 : 2020/05/08 11:59 (試用期限至 2021/05/08)
    ∙ 專案名稱(專案ID) : Web Community
    ∙ Compute Engine VM
        * Name : daniel-918369
        * Region : us-west1-b (奧勒岡州)
        * Machine type : f1-micro (1 個 vCPU，614MB 記憶體)
        * Boot disk : Debian GNU/Linux 9(stretch) 30GB HDD
        * Identity and API access : 允許預設存取權
        * Firewall : 允許 HTTP 流量、允許 HTTPS 流量
        * IP : 34.105.17.84
        * Port : 3306(MySQL)、3000(API)、8080(跨域)
        
## MySQL 資料庫
    ∙ Host : 34.105.17.84
    ∙ Port: 3306
    ∙ 使用者 : root
    ∙ 資料庫名稱：專題資料庫


## API 列表
* Host : 34.105.17.84
* Port : 3000
```
    * 測試連線
        API : /api/testConnect
        Method : GET
        Output : 若成功回傳則會輸出 success，可用來簡易測試是否連線

    * 註冊
        API : /api/signup
        Method : POST
        Input : 使用者名稱、信箱、密碼、生日、性別
        Output : 成功註冊、帳號已存在、無效帳號
```

## 伺服器檔案架構
* Path : /var/www/html/
```
├── test (測試)
|
└── Web_Community (專案)
```

## 專案架構
* Path : /var/www/html/Web_Community
```
├── README.md (說明檔)
|
├── api
|   ├── cors.js (跨域處理)
|   └── main.js (api檔)
|
├── web (網頁端)
|   ├── css
|   |
|   ├── fonts
|   |
|   ├── fragments (套件檔案)
|   |   ├── bootbox (警示框)
|   |   ├── bootstrap
|   |   ├── datatable (表格)
|   |   ├── fontawesome (小圖案)
|   |   └── jquery
|   |
|   ├── img
|   |
|   ├── js
|   |
|   ├── anonymous.html (匿名)
|   ├── forgot.html (忘記密碼)
|   ├── friend.html (朋友列表)
|   ├── group.html (社團)
|   ├── index.html (首頁)
|   ├── login.html (登入)
|   ├── pickcard.html (抽卡)
|   ├── profile.html (個人資料)
|   ├── signup.html (註冊)
└── └── createNew.html (申請新密碼)
```
