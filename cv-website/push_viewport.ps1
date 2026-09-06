& "C:\Program Files\Git\cmd\git.exe" add *.html
& "C:\Program Files\Git\cmd\git.exe" commit -m "Change viewport to render desktop version on mobile"

$clientId = '178c6fc778ccc68e1d6a'
$deviceCode = 'fc9f2eca6c31091c89355fe8ac621e7e6946707a'
$token = $null

while ($true) {
    try {
        $response = Invoke-RestMethod -Uri 'https://github.com/login/oauth/access_token' -Method Post -Body "client_id=$clientId&device_code=$deviceCode&grant_type=urn:ietf:params:oauth:grant-type:device_code" -Headers @{ 'Accept' = 'application/json' }
        if ($response.access_token) {
            $token = $response.access_token
            break
        }
    } catch {}
    Start-Sleep -Seconds 6
}

& "C:\Program Files\Git\cmd\git.exe" remote set-url origin "https://oauth2:$token@github.com/hoanglongkudo8386-byte/cvxinvc2003.git"
& "C:\Program Files\Git\cmd\git.exe" push origin main
& "C:\Program Files\Git\cmd\git.exe" remote set-url origin "https://github.com/hoanglongkudo8386-byte/cvxinvc2003.git"
