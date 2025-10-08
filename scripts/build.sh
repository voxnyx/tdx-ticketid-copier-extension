#!/bin/bash

if [[ "$#" -eq 0 ]]; then 
    echo "Please select which extension to build:"
    echo -e "\t --firefox - builds firefox extension"
fi

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --firefox)
        cd ./src/firefox
        zip -r ../../dist/firefox.zip ./*
        echo "Firefox Extension Packed"
        exit 0
        ;;
        --chrome)
        cd ./src/chrome
        zip -r ../../dist/chrome.zip ./*
        echo "Chrome Extension Packed"
        exit 0
        ;;
    esac
done