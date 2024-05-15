#!/bin/bash

# Variablen initialisieren
sourceDir="."
outputFile="CopyForGPT.diff"
extensions=("*.ts" "*.json" "*.yaml")
excludeDirs=("node_modules" "build")
excludeFiles=("package-lock.json" ".*")

# Zieldatei erstellen oder leeren
if [ ! -f "$outputFile" ]; then
    touch "$outputFile"
else
    > "$outputFile"
fi

# Funktion zur Überprüfung, ob der Pfad ausschließende Verzeichnisse oder Dateien enthält
isExcluded() {
    local path="$1"

    for excludeDir in "${excludeDirs[@]}"; do
        if [[ "$path" == *"/$excludeDir/"* ]]; then
            return 0
        fi
    done

    for excludeFile in "${excludeFiles[@]}"; do
        if [[ "$path" == *"$excludeFile" ]]; then
            return 0
        fi
    done

    return 1
}

# Schleife über die zu filternden Erweiterungen
for extension in "${extensions[@]}"; do
    # Suche alle Dateien mit der aktuellen Erweiterung im Verzeichnis und dessen Unterverzeichnisse
    find "$sourceDir" -name "$extension" -type f | while read -r filePath; do
        # Überprüfen, ob die Datei oder das Verzeichnis ausgeschlossen werden soll
        if isExcluded "$filePath" || [[ "$(basename "$filePath")" =~ ^\..* ]]; then
            continue
        fi

        # Den Inhalt der Datei erhalten und es zur Zieldatei hinzufügen
        echo "Datei: $filePath" >> "$outputFile"
        cat "$filePath" >> "$outputFile"
        echo -e "\n" >> "$outputFile"  # Leere Zeile zur Trennung zwischen Dateien
    done
done
