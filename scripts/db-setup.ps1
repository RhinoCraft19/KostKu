# ============================================================
# KostOS — Database Setup Helper
# Jalankan script ini setelah mendapatkan password DB yang benar
# dari Supabase Dashboard > Settings > Database
# ============================================================
#
# CARA PAKAI:
#   1. Edit PASSWORD di bawah ini
#   2. Jalankan di PowerShell: .\scripts\db-setup.ps1
#   3. Script akan otomatis update .env.local dan push schema
#
# ⚠️ PENTING: Gunakan password yang HANYA huruf + angka
#    Contoh: KostosDB2024abc
#    JANGAN pakai: @, #, $, %, !, ?, &, (, )
# ============================================================

param(
    [string]$Password = "",
    [string]$ProjectRef = "kvxdqhaulnlupczigbls"
)

if ($Password -eq "") {
    $Password = Read-Host "Masukkan Database Password dari Supabase Dashboard"
}

if ($Password -eq "") {
    Write-Host "❌ Password tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

# URL-encode special characters
$EncodedPassword = [System.Uri]::EscapeDataString($Password)

$PoolerHost = "aws-0-ap-southeast-1.pooler.supabase.com"
$DirectHost = "db.$ProjectRef.supabase.co"

$DatabaseUrl = "postgresql://postgres.$ProjectRef`:$EncodedPassword@$PoolerHost`:6543/postgres?pgbouncer=true"
$DirectUrl   = "postgresql://postgres:$EncodedPassword@$DirectHost`:5432/postgres"

Write-Host ""
Write-Host "📋 URL yang akan digunakan:" -ForegroundColor Cyan
Write-Host "  DATABASE_URL (pooler, port 6543): ...@$PoolerHost`:6543/postgres" -ForegroundColor Gray
Write-Host "  DIRECT_URL   (direct, port 5432): ...@$DirectHost`:5432/postgres" -ForegroundColor Gray
Write-Host ""

# Update .env.local
$EnvFile = Join-Path $PSScriptRoot ".." ".env.local"
$EnvFile = Resolve-Path $EnvFile

$content = Get-Content $EnvFile -Raw

# Replace DATABASE_URL
$content = $content -replace 'DATABASE_URL=.*', "DATABASE_URL=$DatabaseUrl"
# Replace DIRECT_URL  
$content = $content -replace 'DIRECT_URL=.*', "DIRECT_URL=$DirectUrl"

Set-Content -Path $EnvFile -Value $content -NoNewline
Write-Host "✅ .env.local diperbarui" -ForegroundColor Green

# Test koneksi dengan prisma db push via session pooler
Write-Host ""
Write-Host "🔄 Menjalankan prisma db push..." -ForegroundColor Cyan

$env:DATABASE_URL = "postgresql://postgres.$ProjectRef`:$EncodedPassword@$PoolerHost`:5432/postgres"

Set-Location (Split-Path $EnvFile)
$result = npx prisma db push 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Schema berhasil di-push ke database!" -ForegroundColor Green
    Write-Host "🔄 Generate Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
    Write-Host "✅ Prisma Client berhasil di-generate!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Gagal push schema. Output:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solusi yang mungkin:" -ForegroundColor Cyan
    Write-Host "  1. Pastikan project Supabase tidak PAUSED (cek di dashboard)"
    Write-Host "  2. Pastikan password benar (reset di Settings > Database jika perlu)"
    Write-Host "  3. Pastikan password TIDAK mengandung karakter spesial: @ # $ % ! ?"
}
