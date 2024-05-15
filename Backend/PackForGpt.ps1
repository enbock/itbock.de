$sourceDir = "."
$outputFile = "CopyForGPT.diff"
$extensions = @('*.ts', '*.json', '*.yaml')
$excludeDirs = @('node_modules', 'build')
$excludeFiles = @('package-lock.json', '.*')

# Stelle sicher, dass die Zieldatei existiert, oder erstelle sie
if (-not (Test-Path -Path $outputFile))
{
    New-Item -ItemType File -Path $outputFile | Out-Null
}
else
{
    # Leere die Zieldatei, falls sie bereits existiert
    Clear-Content $outputFile
}

# Funktion zum Überprüfen, ob der Pfad Verzeichnisse aus der Ausschlussliste enthält
function IsExcluded
{
    param ($path, $excludeDirs, $excludeFiles)
    foreach ($excludeDir in $excludeDirs)
    {
        if ($path -like "*\$excludeDir\*")
        {
            return $true
        }
    }
    foreach ($excludeFile in $excludeFiles)
    {
        if ($path -like "*\$excludeFile")
        {
            return $true
        }
    }
    return $false
}

# Schleife über die zu filternden Erweiterungen
foreach ($extension in $extensions)
{
    # Suche alle Dateien mit der aktuellen Erweiterung im Verzeichnis und dessen Unterverzeichnisse
    Get-ChildItem -Path $sourceDir -Filter $extension -File -Recurse | ForEach-Object {
        $filePath = $_.FullName

        # Überprüfen, ob die Datei oder das Verzeichnis ausgeschlossen werden soll
        if (-not (IsExcluded -path $filePath -excludeDirs $excludeDirs -excludeFiles $excludeFiles) -and -not ($_.Name.StartsWith(".")))
        {
            $content = Get-Content $filePath

            # Schreibe den Dateipfad und den Inhalt der Datei in die Zieldatei
            Add-Content $outputFile -Value "Datei: $filePath"
            Add-Content $outputFile -Value $content
            Add-Content $outputFile -Value "`n"  # Leere Zeile zur Trennung zwischen Dateien
        }
    }
}
