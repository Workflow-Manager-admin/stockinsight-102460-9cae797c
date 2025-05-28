#!/bin/bash
cd /home/kavia/workspace/code-generation/stockinsight-102460-9cae797c/stockinsight
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

