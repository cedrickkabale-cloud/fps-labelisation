# Script PowerShell pour installer et démarrer l'application
# Usage: .\start_dev.ps1

$ErrorActionPreference = "Stop"

# Fonction pour vérifier si Node.js est installé
function Test-NodeJS {
    try {
        $nodeVersion = node -v
        Write-Host "Node.js trouvé : $nodeVersion"
        return $true
    }
    catch {
        Write-Host "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
        return $false
    }
}

# Vérifie Node.js
if (-not (Test-NodeJS)) {
    exit 1
}

# Chemin du projet
$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverPath = Join-Path $rootPath "server"
$clientPath = Join-Path $rootPath "client"

# Installation des dépendances du serveur
Write-Host "Installation des dépendances du serveur..."
Set-Location $serverPath
npm install

# Installation des dépendances du client
Write-Host "Installation des dépendances du client..."
Set-Location $clientPath
npm install

# Démarrage en parallèle
Write-Host "Démarrage de l'application..."

$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:serverPath
    npm start
}

$clientJob = Start-Job -ScriptBlock {
    Set-Location $using:clientPath
    npm start
}

# Attendre et afficher la sortie
try {
    Write-Host "L'application démarre..."
    Write-Host "Client : http://localhost:3000"
    Write-Host "Server : http://localhost:3001"
    Write-Host "Appuyez sur Ctrl+C pour arrêter"
    
    while ($true) {
        Receive-Job $serverJob
        Receive-Job $clientJob
        Start-Sleep -Seconds 1
    }
}
finally {
    # Nettoyage à la sortie
    Stop-Job $serverJob
    Stop-Job $clientJob
    Remove-Job $serverJob
    Remove-Job $clientJob
}