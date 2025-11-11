# Script PowerShell pour initialiser la base SQLite et démarrer le serveur PHP intégré
# Usage: Ouvrir PowerShell en tant qu'administrateur (si besoin), puis : .\start_app.ps1

$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $proj

# Trouver php.exe : préférence PATH sinon XAMPP
$phpExe = $null
if (Get-Command php -ErrorAction SilentlyContinue) {
    $phpExe = 'php'
} elseif (Test-Path 'C:\xampp\php\php.exe') {
    $phpExe = 'C:\xampp\php\php.exe'
} else {
    Write-Error "php introuvable. Installez PHP CLI ou XAMPP et ajoutez php.exe au PATH."
    exit 1
}

Write-Host "Utilisation de : $phpExe"

# Initialiser SQLite
Write-Host "Initialisation de la base SQLite..."
& $phpExe "php/sqlite_init.php"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Attention : l'initialisation a retourné un code d'erreur ($LASTEXITCODE). Vérifiez les messages ci-dessus."
}

# Démarrer le serveur intégré
$port = 8000
Write-Host "Démarrage du serveur PHP intégré sur http://localhost:$port ... (Ctrl+C pour arrêter)"
& $phpExe -S "localhost:$port"
