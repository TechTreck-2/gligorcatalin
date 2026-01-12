#!/bin/bash

# Test script for Time Tracking API

BASE_URL="http://localhost:8080/api/time-entries"

echo "======================================"
echo "Time Tracking API Test Suite"
echo "======================================"

echo ""
echo "1. Creating a test time entry..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "date": "2025-12-16",
      "type": "WORK",
      "startTime": "09:00:00",
      "endTime": "17:00:00",
      "duration": 28800,
      "durationSeconds": 28800,
      "durationFormatted": "08:00:00",
      "description": "Backend development work",
      "statuss": "Pending",
      "email": "test@example.com"
    }
  }')

echo "Response: $CREATE_RESPONSE"
ENTRY_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "Created entry with ID: $ENTRY_ID"

echo ""
echo "2. Getting all time entries..."
curl -s $BASE_URL | json_pp

echo ""
echo "3. Getting entry by ID ($ENTRY_ID)..."
curl -s $BASE_URL/$ENTRY_ID | json_pp

echo ""
echo "4. Updating the entry..."
curl -s -X PUT $BASE_URL/$ENTRY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "date": "2025-12-16",
      "type": "WORK",
      "startTime": "09:00:00",
      "endTime": "18:00:00",
      "duration": 32400,
      "durationSeconds": 32400,
      "durationFormatted": "09:00:00",
      "description": "Backend development work - updated",
      "statuss": "Completed"
    }
  }' | json_pp

echo ""
echo "5. Testing validation - invalid email..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "date": "2025-12-16",
      "type": "WORK",
      "duration": 3600,
      "email": "invalid-email"
    }
  }' | json_pp

echo ""
echo "6. Deleting the entry..."
curl -s -X DELETE $BASE_URL/$ENTRY_ID | json_pp

echo ""
echo "======================================"
echo "Test Complete!"
echo "======================================"
