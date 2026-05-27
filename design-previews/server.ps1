param([int]$Port = 5520, [string]$File = "design-1-parchment.html")

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Serving $File on http://localhost:$Port/"

while ($l.IsListening) {
    $ctx = $l.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = $File }

    $fullPath = Join-Path $dir $path
    if (Test-Path $fullPath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $res.ContentType = "text/html; charset=utf-8"
        $res.ContentLength64 = $bytes.LongLength
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        $res.ContentLength64 = $notFound.LongLength
        $res.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    $res.OutputStream.Close()
}
