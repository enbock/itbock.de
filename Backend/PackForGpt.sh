#!/bin/bash

sourceDir="."
outputFile="CopyForGPT.diff"
extensions=("*.ts" "*.json" "*.yaml")
excludeDirs=("node_modules" "build")
excludeFiles=("package-lock.json" ".*")

if [ ! -f "$outputFile" ]; then
    touch "$outputFile"
else
    > "$outputFile"
fi

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

for extension in "${extensions[@]}"; do
    find "$sourceDir" -name "$extension" -type f | while read -r filePath; do
        if isExcluded "$filePath" || [[ "$(basename "$filePath")" =~ ^\..* ]]; then
            continue
        fi

        echo "#### $filePath" >> "$outputFile"
        cat "$filePath" >> "$outputFile"
        echo -e "\n" >> "$outputFile"  # Leere Zeile zur Trennung zwischen Dateien
    done
done
