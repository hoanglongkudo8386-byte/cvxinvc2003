$clientId = '178c6fc778ccc68e1d6a'
$deviceCode = '721a511eb946536826b3ffc78b04097244c43548'
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
& "C:\Program Files\Git\cmd\git.exe" push -u origin main
& "C:\Program Files\Git\cmd\git.exe" remote set-url origin "https://github.com/hoanglongkudo8386-byte/cvxinvc2003.git"
