/**
 * Arrays de logs vacíos listos para ser rellenados manualmente para pruebas.
 */

const logsArray = [
    // ==========================================
    // LOG 1: Amex 501 Bank Unavailable
    // ==========================================
    `[2026-02-26T23:05:33.119Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: 2captcha","ts":1772147133118}
[2026-02-26T23:05:33.122Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: capsolver","ts":1772147133122}
[2026-02-26T23:05:33.122Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: anticaptcha","ts":1772147133122}
[2026-02-26T23:05:33.629Z] [CUSTOM_LOG] ================================================>>> STARTING CRAWLER V2.3 <<<
[2026-02-26T23:05:33.657Z] [CUSTOM_LOG] ==> Load libraries and globals
[2026-02-26T23:05:33.658Z] [CUSTOM_LOG] ==> Run crawler
[2026-02-26T23:05:33.658Z] [CUSTOM_LOG] ===============PBR PARAMETERS
[2026-02-26T23:05:33.659Z] [CUSTOM_LOG] {"id_job":"69a0d1bb13c7d053b36f8924","id_job_uuid":"69a0d1bb13c7d053b36f8925"}
[2026-02-26T23:05:33.659Z] [CUSTOM_LOG] incoming is_twofa: 1, setting isTwofa: 1
[2026-02-26T23:05:33.659Z] [CUSTOM_LOG] avaialble ports: [33503,33603,33703]
[2026-02-26T23:05:33.664Z] [CUSTOM_LOG] Selected port: 33503
[2026-02-26T23:05:35.070Z] [CUSTOM_LOG] =======Server listening port:33503
[2026-02-26T23:05:35.070Z] [CUSTOM_LOG] ==> Run script
[2026-02-26T23:05:35.074Z] [CUSTOM_LOG] Ejecución normal
[2026-02-26T23:05:35.075Z] [CUSTOM_LOG] American Express Tarjetahabientes
[2026-02-26T23:05:35.078Z] [CUSTOM_LOG] opts.version
[2026-02-26T23:05:35.089Z] [CUSTOM_LOG] --->>>Entro a PROD<<<---
[2026-02-26T23:05:35.089Z] [CUSTOM_LOG] await pbr.proxy.useProxy('AWS', { useDirectIP: true })
[2026-02-26T23:05:35.092Z] [CUSTOM_LOG] Proxy: 10.42.96.8:8080
[2026-02-26T23:05:36.462Z] [CUSTOM_LOG] =====>>>>> Iniciando Browser <<<<<=====
[2026-02-26T23:05:36.463Z] [CUSTOM_LOG] Corriendo en : PROD
[2026-02-26T23:05:36.504Z] [CUSTOM_LOG] Fecha : 2/26/2026, 5:05:36 PM
[2026-02-26T23:05:36.516Z] [CUSTOM_LOG] ===================> 001 GET https://job.paybook.aws/v1/jobs/69a0d1bb13c7d053b36f8925/user-profile
[2026-02-26T23:05:36.806Z] [CUSTOM_LOG] Perfil Existente: true
[2026-02-26T23:05:36.813Z] [CUSTOM_LOG] {
    "logger": {
        "status": "stop",
        "counter": 0,
        "files": []
    },
    "PROFILE_DIR": "/tmp/browser-profiles/69a0d1bb13c7d053b36f8925",
    "TEST_MODE": false
}
[2026-02-26T23:05:36.813Z] [CUSTOM_LOG] Profile Exist: true
[2026-02-26T23:05:36.813Z] [CUSTOM_LOG] Profile Value: true
[2026-02-26T23:05:36.813Z] [CUSTOM_LOG] Existe el config.json: true /tmp/browser-profiles/69a0d1bb13c7d053b36f8925/config.json
[2026-02-26T23:05:36.814Z] [CUSTOM_LOG] config
[2026-02-26T23:05:36.814Z] [CUSTOM_LOG] {"fingerprint":{"screen":{"availTop":0,"availLeft":0,"pageXOffset":0,"pageYOffset":0,"screenX":0,"hasHDR":false,"width":1536,"height":864,"availWidth":1536,"availHeight":816,"clientWidth":0,"clientHeight":18,"innerWidth":0,"innerHeight":0,"outerWidth":1536,"outerHeight":816,"colorDepth":24,"pixelDepth":24,"devicePixelRatio":1.25},"navigator":{"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","userAgentData":{"brands":[{"brand":"Google Chrome","version":"143"},{"brand":"Chromium","version":"143"},{"brand":"Not A(Brand","version":"24"}],"mobile":false,"platform":"Windows","architecture":"x86","bitness":"64","model":"","platformVersion":"19.0.0","uaFullVersion":"143.0.7499.170","fullVersionList":[{"brand":"Google Chrome","version":"143.0.7499.170"},{"brand":"Chromium","version":"143.0.7499.170"},{"brand":"Not A(Brand","version":"24.0.0.0"}]},"language":"en-US","languages":["en-US"],"platform":"Win32","deviceMemory":8,"hardwareConcurrency":8,"maxTouchPoints":0,"product":"Gecko","productSub":"20030107","vendor":"Google Inc.","vendorSub":null,"doNotTrack":null,"appCodeName":"Mozilla","appName":"Netscape","appVersion":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","oscpu":null,"extraProperties":{"vendorFlavors":["chrome"],"globalPrivacyControl":null,"pdfViewerEnabled":true,"installedApps":[]},"webdriver":false},"audioCodecs":{"ogg":"probably","mp3":"probably","wav":"probably","m4a":"maybe","aac":"probably"},"videoCodecs":{"ogg":"","h264":"probably","webm":"probably"},"pluginsData":{"plugins":[{"name":"PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"PDF Viewer"}]},{"name":"Chrome PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chrome PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chrome PDF Viewer"}]},{"name":"Chromium PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chromium PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chromium PDF Viewer"}]},{"name":"Microsoft Edge PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Microsoft Edge PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Microsoft Edge PDF Viewer"}]},{"name":"WebKit built-in PDF","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"WebKit built-in PDF"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"WebKit built-in PDF"}]}],"mimeTypes":["Portable Document Format~~application/pdf~~pdf","Portable Document Format~~text/pdf~~pdf"]},"battery":{"charging":true,"chargingTime":0,"dischargingTime":null,"level":1},"videoCard":{"renderer":"ANGLE (NVIDIA, NVIDIA GeForce GT 710 (0x0000128B) Direct3D11 vs_5_0 ps_5_0, D3D11)","vendor":"Google Inc. (NVIDIA)"},"multimediaDevices":{"speakers":[{"deviceId":"","kind":"audiooutput","label":"","groupId":""}],"micros":[{"deviceId":"","kind":"audioinput","label":"","groupId":""}],"webcams":[{"deviceId":"","kind":"videoinput","label":"","groupId":""}]},"fonts":["Calibri","MS UI Gothic","Marlett","Segoe UI Light"],"mockWebRTC":false,"slim":false},"headers":{"sec-ch-ua":"\\"Brave\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\\"Windows\\"","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","sec-fetch-site":"same-site","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br, zstd","accept-language":"en-US","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"},"coordinates":{"country":"MX","actualCountry":"MX","latitude":19.339467,"longitude":-111.311014,"success":true,"usedFallback":false,"bounds":{"latMin":14.6,"latMax":32.6,"lngMin":-117.1,"lngMax":-86.7},"description":"Coordenadas aleatorias generadas dentro de MX"},"latitud":19.339467,"longitude":-111.311014,"cluster":"auto","proxy":{"PORT":8080,"SERVER":"10.132.0.9","USERNAME":null,"PASSWORD":null,"CA":null,"bypass":"localhost"}}
[2026-02-26T23:05:36.815Z] [CUSTOM_LOG] El userAgent de config.json NO contiene "chromium", se ignorará el userprofile y se generará todo como nuevo
[2026-02-26T23:05:36.815Z] [CUSTOM_LOG] Proxy Configurado [auto] : 10.42.96.8:8080
[2026-02-26T23:05:36.815Z] [CUSTOM_LOG] No existe el config.json o no existe el userAgent
[2026-02-26T23:05:37.093Z] [CUSTOM_LOG] Locale extraído del accept-language header:
[2026-02-26T23:05:37.093Z] [CUSTOM_LOG] -- Se inicia XVFB --
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] Browser Modo : -DINAMICO-
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] this.headers existe:
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] this.userAgent:
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] contextExtraHeaders keys:
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] contextExtraHeaders accept-language:
[2026-02-26T23:05:37.112Z] [CUSTOM_LOG] contextExtraHeaders accept-encoding:
[2026-02-26T23:05:37.966Z] [CUSTOM_LOG] Inyectando fingerprint
[2026-02-26T23:05:37.974Z] [CUSTOM_LOG] this.fingerprint
[2026-02-26T23:05:37.974Z] [CUSTOM_LOG] this.proxy
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.browserOptions
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.userAgent
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.headers
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.latitud
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.longitude
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.userDataDir
[2026-02-26T23:05:37.975Z] [CUSTOM_LOG] this.proxy
[2026-02-26T23:05:37.998Z] [CUSTOM_LOG] Navigate to login page
[2026-02-26T23:05:38.002Z] [CUSTOM_LOG] [0299] GOTO: https://www.americanexpress.com/es-mx/account/login
[2026-02-26T23:05:45.945Z] [CUSTOM_LOG] [0299] CONTENT: login
[2026-02-26T23:05:46.508Z] [CUSTOM_LOG] =====> Start tracking HAR <=====
[2026-02-26T23:05:46.514Z] [CUSTOM_LOG] Check if the login page loading successfully
[2026-02-26T23:05:52.794Z] [CUSTOM_LOG] === Take screenshot: undefined
[2026-02-26T23:05:52.801Z] [CUSTOM_LOG] Error when try to create the screenshot with Playwright
[2026-02-26T23:05:52.801Z] [CUSTOM_LOG] page.screenshot is not a function
[2026-02-26T23:05:52.801Z] [CUSTOM_LOG] === sn: 1_home_login_page
[2026-02-26T23:05:52.802Z] [CUSTOM_LOG] Error when try to create the snapshot with Playwright
[2026-02-26T23:05:52.802Z] [CUSTOM_LOG] Cannot read properties of undefined (reading 'content')
[2026-02-26T23:05:52.802Z] [CUSTOM_LOG] No cambiamos de tarjetahabientes
[2026-02-26T23:05:57.265Z] [CUSTOM_LOG] ✅ Human click en button#loginSubmit (default)
[2026-02-26T23:05:57.282Z] [CUSTOM_LOG] Recovering data from login request
[2026-02-26T23:05:59.091Z] [CUSTOM_LOG] === Take screenshot: 3_Test0
[2026-02-26T23:05:59.311Z] [CUSTOM_LOG] === Take screenshot: undefined
[2026-02-26T23:05:59.317Z] [CUSTOM_LOG] Error when try to create the screenshot with Playwright
[2026-02-26T23:05:59.317Z] [CUSTOM_LOG] page.screenshot is not a function
[2026-02-26T23:05:59.317Z] [CUSTOM_LOG] == Closing context and browser to continue by petitions ==
[2026-02-26T23:05:59.317Z] [CUSTOM_LOG] Tarjetahabientes close browser
[2026-02-26T23:06:04.322Z] [CUSTOM_LOG] Entrando sin segundo factor de autenticación
[2026-02-26T23:06:04.327Z] [CUSTOM_LOG] === Take screenshot: 3_Test1
[2026-02-26T23:06:04.494Z] [CUSTOM_LOG] Wait a second to start the process
[2026-02-26T23:06:04.501Z] [CUSTOM_LOG] [0731] awaitResponse(0): https://global.americanexpress.com/myca/logon/canlac/action/login
[2026-02-26T23:06:04.502Z] [CUSTOM_LOG] responseObj.body
[2026-02-26T23:06:04.507Z] [CUSTOM_LOG] [0739] awaitResponse(0): https://global.americanexpress.com/myca/logon/canlac/action/login
[2026-02-26T23:06:04.507Z] [CUSTOM_LOG] Get the cookies of the page and set to next requests
[2026-02-26T23:06:05.520Z] [CUSTOM_LOG] === Take screenshot: 4_Test1
[2026-02-26T23:06:05.702Z] [CUSTOM_LOG] ====== >>> Cerrando Browser <<< ======
[2026-02-26T23:06:05.804Z] [CUSTOM_LOG] context cerrado
[2026-02-26T23:06:05.810Z] [CUSTOM_LOG] guardando perfil
[2026-02-26T23:06:05.812Z] [CUSTOM_LOG] {"fingerprint":{"screen":{"availTop":0,"availLeft":0,"pageXOffset":0,"pageYOffset":0,"screenX":0,"hasHDR":false,"width":1920,"height":1080,"availWidth":1920,"availHeight":1040,"clientWidth":0,"clientHeight":18,"innerWidth":0,"innerHeight":0,"outerWidth":1920,"outerHeight":1040,"colorDepth":24,"pixelDepth":24,"devicePixelRatio":1},"navigator":{"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","userAgentData":{"brands":[{"brand":"Google Chrome","version":"143"},{"brand":"Chromium","version":"143"},{"brand":"Not A(Brand","version":"24"}],"mobile":false,"platform":"Windows","architecture":"x86","bitness":"64","model":"","platformVersion":"10.0.0","uaFullVersion":"143.0.7499.170","fullVersionList":[{"brand":"Google Chrome","version":"143.0.7499.170"},{"brand":"Chromium","version":"143.0.7499.170"},{"brand":"Not A(Brand","version":"24.0.0.0"}]},"language":"en-US","languages":["en-US"],"platform":"Win32","deviceMemory":8,"hardwareConcurrency":4,"maxTouchPoints":0,"product":"Gecko","productSub":"20030107","vendor":"Google Inc.","vendorSub":null,"doNotTrack":null,"appCodeName":"Mozilla","appName":"Netscape","appVersion":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","oscpu":null,"extraProperties":{"vendorFlavors":["chrome"],"globalPrivacyControl":null,"pdfViewerEnabled":true,"installedApps":[]},"webdriver":false},"audioCodecs":{"ogg":"probably","mp3":"probably","wav":"probably","m4a":"maybe","aac":"probably"},"videoCodecs":{"ogg":"","h264":"probably","webm":"probably"},"pluginsData":{"plugins":[{"name":"PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"PDF Viewer"}]},{"name":"Chrome PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chrome PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chrome PDF Viewer"}]},{"name":"Chromium PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chromium PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Chromium PDF Viewer"}]},{"name":"Microsoft Edge PDF Viewer","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Microsoft Edge PDF Viewer"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"Microsoft Edge PDF Viewer"}]},{"name":"WebKit built-in PDF","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeTypes":[{"type":"application/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"WebKit built-in PDF"},{"type":"text/pdf","suffixes":"pdf","description":"Portable Document Format","enabledPlugin":"WebKit built-in PDF"}]}],"mimeTypes":["Portable Document Format~~application/pdf~~pdf","Portable Document Format~~text/pdf~~pdf"]},"battery":{"charging":true,"chargingTime":0,"dischargingTime":null,"level":1},"videoCard":{"renderer":"ANGLE (Intel, Intel(R) HD Graphics Direct3D9Ex vs_3_0 ps_3_0, igdumd64.dll)","vendor":"Google Inc. (Intel)"},"multimediaDevices":{"speakers":[{"deviceId":"","kind":"audiooutput","label":"","groupId":""}],"micros":[{"deviceId":"","kind":"audioinput","label":"","groupId":""}],"webcams":[{"deviceId":"","kind":"videoinput","label":"","groupId":""}]},"fonts":["Agency FB","Calibri","Century","Century Gothic","Franklin Gothic","Haettenschweiler","Leelawadee","Lucida Bright","Lucida Sans","MS Outlook","MS Reference Specialty","MS UI Gothic","MT Extra","Marlett","Microsoft Uighur","Monotype Corsiva","Pristina","Segoe UI Light"],"mockWebRTC":false,"slim":false},"headers":{"sec-ch-ua":"\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\\"Windows\\"","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","sec-fetch-site":"same-site","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br, zstd","accept-language":"en-US","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"},"coordinates":{"country":"MX","actualCountry":"MX","latitude":24.105347,"longitude":-107.490695,"success":true,"usedFallback":false,"bounds":{"latMin":14.6,"latMax":32.6,"lngMin":-117.1,"lngMax":-86.7},"description":"Coordenadas aleatorias generadas dentro de MX"},"latitud":24.105347,"longitude":-107.490695,"cluster":"auto","proxy":{"PORT":8080,"SERVER":"10.42.96.8","USERNAME":null,"PASSWORD":null,"CA":null,"bypass":"localhost"}}
[2026-02-26T23:06:05.812Z] [CUSTOM_LOG] Profile saved successfully: /tmp/browser-profiles/69a0d1bb13c7d053b36f8925/config.json
[2026-02-26T23:06:05.822Z] [CUSTOM_LOG] ============ TAMAÑO DEL DIRECTORIO: 12K	/tmp/browser-profiles/69a0d1bb13c7d053b36f8925
[2026-02-26T23:06:05.854Z] [CUSTOM_LOG] ============ TAMAÑO ARCHIVO COMPRIMIDO: 1.88KB
[2026-02-26T23:06:05.854Z] [CUSTOM_LOG] ============ TAMAÑO BASE64: 2.5KB (2564 caracteres)
[2026-02-26T23:06:05.855Z] [CUSTOM_LOG] ===================> 002 POST https://job.paybook.aws/v1/jobs/69a0d1bb13c7d053b36f8925/user-profile
[2026-02-26T23:06:05.986Z] [CUSTOM_LOG] ============ PERFIL GUARDADO EXITOSAMENTE
[2026-02-26T23:06:05.987Z] [CUSTOM_LOG] postDataLoginStr
[2026-02-26T23:06:05.988Z] [CUSTOM_LOG] transactionId
[2026-02-26T23:06:05.988Z] [CUSTOM_LOG] nowDate
[2026-02-26T23:06:10.988Z] [CUSTOM_LOG] Retry because the request _login return error in the body
[2026-02-26T23:06:11.001Z] [CUSTOM_LOG] ===================> 05_login_retry POST https://global.americanexpress.com/myca/logon/canlac/action/login
[2026-02-26T23:06:11.106Z] [CUSTOM_LOG] ====== Log Errors
[2026-02-26T23:06:11.110Z] [CUSTOM_LOG] {
    "code": 501,
    "reason": "Bank unavailable"
}
[2026-02-26T23:06:11.112Z] [CUSTOM_LOG] Error when try the close context or browser
[2026-02-26T23:06:11.112Z] [CUSTOM_LOG] ====== Process the status error
[2026-02-26T23:06:11.112Z] [CUSTOM_LOG] finish
[2026-02-26T23:06:11.112Z] [CUSTOM_LOG] finish code: 501
[2026-02-26T23:06:11.112Z] [CUSTOM_LOG] shutting down
[2026-02-26T23:06:11.115Z] [CUSTOM_LOG] closing server port: 33503
[2026-02-26T23:06:11.349Z] [CUSTOM_LOG] Success port closed: 33503`,

    // ==========================================
    // LOG 2: BBVA Extracción Parcial (253) Timeout
    // ==========================================
    `[2026-02-25T23:08:45.482Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: 2captcha","ts":1772060925482}
[2026-02-25T23:08:45.485Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: capsolver","ts":1772060925485}
[2026-02-25T23:08:45.485Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: anticaptcha","ts":1772060925485}
[2026-02-25T23:08:47.172Z] [CUSTOM_LOG] ================================================>>> STARTING CRAWLER V2.3 <<<
[2026-02-25T23:08:47.241Z] [CUSTOM_LOG] ==> Load libraries and globals
[2026-02-25T23:08:47.241Z] [CUSTOM_LOG] ==> Run crawler
[2026-02-25T23:08:47.241Z] [CUSTOM_LOG] ===============PBR PARAMETERS
[2026-02-25T23:08:47.242Z] [CUSTOM_LOG] {"id_job":"699f80f52d6c09214b0617f2","id_job_uuid":"699f80f52d6c09214b0617f3"}
[2026-02-25T23:08:47.242Z] [CUSTOM_LOG] incoming is_twofa: 0, setting isTwofa: 0
[2026-02-25T23:08:49.749Z] [ERROR] Warning: Plugin is not derived from PuppeteerExtraPlugin, ignoring.
[2026-02-25T23:08:49.749Z] [CUSTOM_LOG] ==> Run script
[2026-02-25T23:08:49.750Z] [CUSTOM_LOG] =====================================FIRST MAIN EXECUTION=====================================
[2026-02-25T23:08:49.764Z] [CUSTOM_LOG] Credentials to run all script
[2026-02-25T23:08:49.764Z] [CUSTOM_LOG] ========= START BROWSER
[2026-02-25T23:08:49.802Z] [CUSTOM_LOG] Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36
[2026-02-25T23:08:49.802Z] [CUSTOM_LOG] Window size generated: 1920x1080
[2026-02-25T23:08:49.802Z] [CUSTOM_LOG] AWS PROXY
[2026-02-25T23:08:49.802Z] [CUSTOM_LOG] proxies-sat-245a6a9b486af236.elb.us-east-1.amazonaws.com:8084
[2026-02-25T23:08:58.435Z] [CUSTOM_LOG] ========== Login ==========
[2026-02-25T23:08:58.482Z] [CUSTOM_LOG] ===== Go to the home page of the bank =====
[2026-02-25T23:09:11.526Z] [CUSTOM_LOG] No duplicate session
[2026-02-25T23:09:19.906Z] [CUSTOM_LOG] ========== Logged ==========
[2026-02-25T23:09:19.914Z] [CUSTOM_LOG] Rompio en la iteración  4
[2026-02-25T23:09:43.371Z] [CUSTOM_LOG] Numero de cuentas: 2
[2026-02-25T23:09:43.382Z] [CUSTOM_LOG] ========== Check if there are multiple currencies ==========
[2026-02-25T23:09:43.382Z] [CUSTOM_LOG] Numero de currencies: 1
[2026-02-25T23:09:43.382Z] [CUSTOM_LOG] Multiple currency: false
[2026-02-25T23:09:43.383Z] [CUSTOM_LOG] Cuenta no agregada aun
[2026-02-25T23:09:43.383Z] [CUSTOM_LOG] ========== Account sent ==========
[2026-02-25T23:09:59.072Z] [CUSTOM_LOG] Cuenta no agregada aun
[2026-02-25T23:09:59.095Z] [CUSTOM_LOG] ========== Account sent ==========
[2026-02-25T23:10:43.702Z] [CUSTOM_LOG] Numero de cuentas: 2
[2026-02-25T23:10:43.766Z] [CUSTOM_LOG] ========== Check if there are multiple currencies ==========
[2026-02-25T23:10:43.767Z] [CUSTOM_LOG] Numero de currencies: 1
[2026-02-25T23:10:43.767Z] [CUSTOM_LOG] Multiple currency: false
[2026-02-25T23:10:43.767Z] [CUSTOM_LOG] Cuenta no agregada aun
[2026-02-25T23:10:43.833Z] [CUSTOM_LOG] ========== Account sent ==========
[2026-02-25T23:11:06.364Z] [CUSTOM_LOG] Cuenta no agregada aun
[2026-02-25T23:11:06.446Z] [CUSTOM_LOG] ========== Account sent ==========
[2026-02-25T23:12:16.328Z] [CUSTOM_LOG] Numero de cuentas: 1
[2026-02-25T23:12:16.341Z] [CUSTOM_LOG] ========== Check if there are multiple currencies ==========
[2026-02-25T23:12:16.341Z] [CUSTOM_LOG] Numero de currencies: 1
[2026-02-25T23:12:16.341Z] [CUSTOM_LOG] Multiple currency: false
[2026-02-25T23:12:16.341Z] [CUSTOM_LOG] Cuenta no agregada aun
[2026-02-25T23:12:16.342Z] [CUSTOM_LOG] ========== Account sent ==========
[2026-02-25T23:13:13.358Z] [CUSTOM_LOG] [TimeoutError] locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span.ng-isolate-scope > img:nth-child(1)')
    - locator resolved to <img alt="Descargar" title="Descargar" src="assets/images/new-design/download.svg"/>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - click action done
    - waiting for scheduled navigations to finish

Stack Trace:
locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span.ng-isolate-scope > img:nth-child(1)')
    - locator resolved to <img alt="Descargar" title="Descargar" src="assets/images/new-design/download.svg"/>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - click action done
    - waiting for scheduled navigations to finish

    at mainFunction (<anonymous>:499:92)
    at async script (<anonymous>:78:16)
    at async run (/data/syncfy.com/production/src/pbcrawler-node2/runpbr.js:436:17)
    at async /data/syncfy.com/production/src/pbcrawler-node2/runpbr.js:471:9
[2026-02-25T23:13:14.887Z] [ERROR] (node:1044059) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use \`node --trace-warnings ...\` to show where the warning was created)
[2026-02-25T23:13:18.787Z] [CUSTOM_LOG] [
    0,
    0,
    0,
    0,
    1
]
[2026-02-25T23:13:18.793Z] [CUSTOM_LOG] Local execution status code: 253
[2026-02-25T23:13:18.793Z] [CUSTOM_LOG] =====================================SUCCESS ON 1 MAIN EXECUTION=====================================
[2026-02-25T23:13:18.793Z] [CUSTOM_LOG] Global execution status code: 253
[2026-02-25T23:13:18.793Z] [CUSTOM_LOG] finish
[2026-02-25T23:13:18.794Z] [CUSTOM_LOG] send data
[2026-02-25T23:13:18.794Z] [CUSTOM_LOG] send all data
[2026-02-25T23:13:18.794Z] [CUSTOM_LOG] ====SEND ALL DATA ACCOUNT
[2026-02-25T23:13:18.804Z] [CUSTOM_LOG] finish code: 253
[2026-02-25T23:13:18.804Z] [CUSTOM_LOG] shutting down
[2026-02-25T23:13:27.253Z] [CUSTOM_LOG] closing server port: `,

    // ==========================================
    // LOG 3: Banorte 507 POST response is null
    // ==========================================
    `[2026-02-26T03:26:09.381Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: 2captcha","ts":1772076369381}
[2026-02-26T03:26:09.383Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: capsolver","ts":1772076369383}
[2026-02-26T03:26:09.383Z] [CUSTOM_LOG] {"type":"log","event":"debug","message":"Proveedor de captcha registrado: anticaptcha","ts":1772076369383}
[2026-02-26T03:26:09.572Z] [CUSTOM_LOG] ================================================>>> STARTING CRAWLER V2.3 <<<
[2026-02-26T03:26:09.585Z] [CUSTOM_LOG] ==> Load libraries and globals
[2026-02-26T03:26:09.585Z] [CUSTOM_LOG] ==> Run crawler
[2026-02-26T03:26:09.585Z] [CUSTOM_LOG] ===============PBR PARAMETERS
[2026-02-26T03:26:09.585Z] [CUSTOM_LOG] {"id_job":"699fbd500d4a1a12a57170c7","id_job_uuid":"699fbd500d4a1a12a57170c8"}
[2026-02-26T03:26:09.585Z] [CUSTOM_LOG] incoming is_twofa: 0, setting isTwofa: 0
[2026-02-26T03:26:09.872Z] [CUSTOM_LOG] ==> Run script
[2026-02-26T03:26:09.874Z] [CUSTOM_LOG] opts.version
[2026-02-26T03:26:09.875Z] [CUSTOM_LOG] --->>>Entro a PROD<<<---
[2026-02-26T03:26:09.875Z] [CUSTOM_LOG] await pbr.proxy.useProxy('AWS', { useDirectIP: true })
[2026-02-26T03:26:09.876Z] [CUSTOM_LOG] Proxy: 10.42.96.8:8080
[2026-02-26T03:26:11.043Z] [CUSTOM_LOG] =====>>>>> Iniciando Browser <<<<<=====
[2026-02-26T03:26:11.043Z] [CUSTOM_LOG] Corriendo en : PROD
[2026-02-26T03:26:11.062Z] [CUSTOM_LOG] Fecha : 2/25/2026, 9:26:11 PM
[2026-02-26T03:26:11.291Z] [CUSTOM_LOG] ===================> 001 GET https://job.paybook.aws/v1/jobs/699fbd500d4a1a12a57170c8/user-profile
[2026-02-26T03:26:11.463Z] [CUSTOM_LOG] Perfil Existente: true
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] {
    "logger": {
        "status": "stop",
        "counter": 0,
        "files": []
    },
    "PROFILE_DIR": "/tmp/browser-profiles/699fbd500d4a1a12a57170c8",
    "TEST_MODE": false
}
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] Profile Exist: true
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] Profile Value: true
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] Existe el config.json: false
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] Proxy Configurado [auto] : 10.42.96.8:8080
[2026-02-26T03:26:11.466Z] [CUSTOM_LOG] No existe el config.json o no existe el userAgent
[2026-02-26T03:26:11.641Z] [CUSTOM_LOG] Locale extraído del accept-language header:
[2026-02-26T03:26:11.641Z] [CUSTOM_LOG] Browser Modo: -PERSISTENTE-
[2026-02-26T03:26:12.487Z] [CUSTOM_LOG] Inyectando fingerprint
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.fingerprint
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.proxy
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.browserOptions
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.userAgent
[2026-02-26T23:26:12.490Z] [CUSTOM_LOG] this.headers
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.latitud
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.longitude
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.userDataDir
[2026-02-26T03:26:12.490Z] [CUSTOM_LOG] this.proxy
[2026-02-26T03:26:12.505Z] [CUSTOM_LOG] [0212] RPC[GET]: https://www.banorte.com/
[2026-02-26T03:26:13.287Z] [CUSTOM_LOG] [0223] getVal: actionforwardPortalPrivado
[2026-02-26T03:26:13.290Z] [WARN]  *** No Existe la variable "actionforwardPortalPrivado" ***
[2026-02-26T03:26:13.574Z] [CUSTOM_LOG] [0230] RPC[POST]: 
[2026-02-26T03:26:19.581Z] [CUSTOM_LOG] -- ERR RPC --
[2026-02-26T03:26:19.584Z] [WARN] undefined
[2026-02-26T03:26:19.585Z] [CUSTOM_LOG] [pbrError] POST response is null: 
Code: 507
Stack Trace:
pbrError: POST response is null: 
    at /data/syncfy.com/production/src/site-scripts/PBModules.js:2516:23
[2026-02-26T03:26:19.585Z] [CUSTOM_LOG] >>>>>>>> === ERROR === <<<<<<<<
[2026-02-26T03:26:19.585Z] [CUSTOM_LOG] [pbrError] POST response is null: 
Code: 507
Stack Trace:
pbrError: POST response is null: 
    at /data/syncfy.com/production/src/site-scripts/PBModules.js:2516:23
[2026-02-26T03:26:19.586Z] [CUSTOM_LOG] [0788] CONTENT: logout
[2026-02-26T03:26:19.586Z] [CUSTOM_LOG] ERR: no Existe Page
[2026-02-26T03:26:19.586Z] [CUSTOM_LOG] ===== >> haciendo logout << =====
[2026-02-26T03:26:19.587Z] [CUSTOM_LOG] ====== >>> Cerrando Browser <<< ======
[2026-02-26T03:26:19.688Z] [CUSTOM_LOG] context cerrado
[2026-02-26T03:26:19.691Z] [CUSTOM_LOG] guardando perfil
[2026-02-26T03:26:19.696Z] [CUSTOM_LOG] ============ TAMAÑO DEL DIRECTORIO: 4.1M	/tmp/browser-profiles/699fbd500d4a1a12a57170c8
[2026-02-26T03:26:19.730Z] [CUSTOM_LOG] ============ TAMAÑO ARCHIVO COMPRIMIDO: 27.07KB
[2026-02-26T03:26:19.730Z] [CUSTOM_LOG] ============ TAMAÑO BASE64: 36.1KB (36964 caracteres)
[2026-02-26T03:26:19.732Z] [CUSTOM_LOG] ===================> 002 POST https://job.paybook.aws/v1/jobs/699fbd500d4a1a12a57170c8/user-profile
[2026-02-26T03:26:19.895Z] [CUSTOM_LOG] ============ PERFIL GUARDADO EXITOSAMENTE
[2026-02-26T03:26:19.907Z] [CUSTOM_LOG] -- despues del logout page --
[2026-02-26T03:26:19.907Z] [CUSTOM_LOG] finish
[2026-02-26T03:26:19.907Z] [CUSTOM_LOG] finish code: 507
[2026-02-26T03:26:19.907Z] [CUSTOM_LOG] shutting down
[2026-02-26T03:26:19.909Z] [CUSTOM_LOG] closing server port: `
];

module.exports = { logsArray };

