& "C:\Program Files\Git\cmd\git.exe" add *.html
& "C:\Program Files\Git\cmd\git.exe" commit -m "Apply recruiter feedback: update skills, objective, and add download CV button"

$clientId = '178c6fc778ccc68e1d6a'
$deviceCode = 'b1c6215bc067187bcdf20ad21e4815144ef37999'
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
