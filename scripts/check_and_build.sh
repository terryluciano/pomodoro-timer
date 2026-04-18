#!/bin/bash

# Change to the directory one level up from where this script is located
cd "$(dirname "$0")/.." || exit 1

echo "Running linting and formatting checks..."

# Lint
bun run lint

# Check for linting errors
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the errors before building."
    exit 1
fi

# Format
bun run format

echo "Checks passed. Building the project..."

# Build
bun run build
