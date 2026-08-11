param (
    [string]$ImagePath
)

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.FileAccessMode, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapPixelFormat, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapAlphaMode, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime] | Out-Null

function Wait-WinRT ($asyncOp) {
    while ($asyncOp.Status.ToString() -eq "Started") {
        [System.Threading.Thread]::Sleep(20)
    }
    return $asyncOp.GetResults()
}

$file = Wait-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath))
$stream = Wait-WinRT ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
$decoder = Wait-WinRT ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
$bitmap = Wait-WinRT ($decoder.GetSoftwareBitmapAsync([Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8, [Windows.Graphics.Imaging.BitmapAlphaMode]::Premultiplied))

$lang = [Windows.Globalization.Language]::new("es-ES")
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}

$ocrResult = Wait-WinRT ($engine.RecognizeAsync($bitmap))
Write-Output $ocrResult.Text
