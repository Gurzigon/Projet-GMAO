# ------------------------------
# Backup automatique de la bdd Docker PostgreSQL (contenu uniquement)
# ------------------------------

# Configuration
$dockerContainer = "gmao-db"               # Nom du conteneur PostgreSQL
$dbName = "gmao"                           # Nom de la base
$dbUser = "postgres"                       # Utilisateur PostgreSQL
$backupDir = "C:\Users\alagutere\Desktop\Projet - Refacto\backups"  # Dossier de sauvegarde
$retentionDays = 7                          # Nombre de jours à conserver

# Crée le dossier de backup s'il n'existe pas
if (-not (Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Nom du fichier avec timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$backupFile = "$backupDir\dump-gmao-$timestamp.sql"

# --- Création du dump (données seulement, pas la base ni les tables) ---
Write-Host "Export de la base '$dbName' depuis le conteneur '$dockerContainer'..."
docker exec -t $dockerContainer pg_dump -U $dbUser --data-only --no-owner --no-acl --format=plain $dbName > $backupFile

if (Test-Path -Path $backupFile) {
    Write-Host "Sauvegarde terminée avec succès : $backupFile"
} else {
    Write-Host "Erreur : la sauvegarde a échoué."
}

# --- Suppression des anciens backups ---
Write-Host "Suppression des backups de plus de $retentionDays jours..."
Get-ChildItem -Path $backupDir -Filter "dump-gmao-*.sql" | Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-$retentionDays)
} | Remove-Item -Force

Write-Host "Nettoyage terminé."