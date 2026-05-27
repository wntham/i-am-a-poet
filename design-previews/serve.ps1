$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5501/")
$listener.Start()
Write-Host "Serving on http://localhost:5501/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath.TrimStart('/')
    if ($path -eq '' -or $path -eq '/') { $path = 'index.html' }
    $filePath = Join-Path "G:\My Drive\learning-project-poet\design-previews" $path

    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.OutputStream.Close()
}
