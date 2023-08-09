#!/bin/bash

if [ "$(uname)" == "Darwin" ]; then
  chmod ug+x .husky/*
fi
