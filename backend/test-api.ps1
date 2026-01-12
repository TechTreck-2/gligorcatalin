# PowerShell Test Script for Time Tracking API

$BASE_URL = "http://localhost:8080/api/time-entries"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Time Tracking API Test Suite" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`n1. Creating a test time entry..." -ForegroundColor Yellow
$createBody = @{
    data = @{
        date = "2025-12-16"
        type = "WORK"
        startTime = "09:00:00"
        endTime = "17:00:00"
        duration = 28800
        durationSeconds = 28800
        durationFormatted = "08:00:00"
        description = "Backend development work"
        statuss = "Pending"
        email = "test@example.com"
    }
} | ConvertTo-Json -Depth 3

$createResponse = Invoke-RestMethod -Uri $BASE_URL -Method Post -Body $createBody -ContentType "application/json"
Write-Host "Response:" -ForegroundColor Green
$createResponse | ConvertTo-Json -Depth 3
$entryId = $createResponse.data.id
Write-Host "Created entry with ID: $entryId" -ForegroundColor Green

Write-Host "`n2. Getting all time entries..." -ForegroundColor Yellow
$allEntries = Invoke-RestMethod -Uri $BASE_URL -Method Get
$allEntries | ConvertTo-Json -Depth 3

Write-Host "`n3. Getting entry by ID ($entryId)..." -ForegroundColor Yellow
$singleEntry = Invoke-RestMethod -Uri "$BASE_URL/$entryId" -Method Get
$singleEntry | ConvertTo-Json -Depth 3

Write-Host "`n4. Updating the entry..." -ForegroundColor Yellow
$updateBody = @{
    data = @{
        date = "2025-12-16"
        type = "WORK"
        startTime = "09:00:00"
        endTime = "18:00:00"
        duration = 32400
        durationSeconds = 32400
        durationFormatted = "09:00:00"
        description = "Backend development work - updated"
        statuss = "Completed"
    }
} | ConvertTo-Json -Depth 3

$updateResponse = Invoke-RestMethod -Uri "$BASE_URL/$entryId" -Method Put -Body $updateBody -ContentType "application/json"
$updateResponse | ConvertTo-Json -Depth 3

Write-Host "`n5. Testing validation - invalid email..." -ForegroundColor Yellow
$invalidBody = @{
    data = @{
        date = "2025-12-16"
        type = "WORK"
        duration = 3600
        email = "invalid-email"
    }
} | ConvertTo-Json -Depth 3

try {
    Invoke-RestMethod -Uri $BASE_URL -Method Post -Body $invalidBody -ContentType "application/json"
} catch {
    Write-Host "Validation Error (Expected):" -ForegroundColor Red
    $_.Exception.Response
}

Write-Host "`n6. Deleting the entry..." -ForegroundColor Yellow
$deleteResponse = Invoke-RestMethod -Uri "$BASE_URL/$entryId" -Method Delete
$deleteResponse | ConvertTo-Json -Depth 3

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
