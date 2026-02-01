# Build and Pre-index data
npm run gen-data
npm run build

Write-Host "Build complete. Files are in 'dist' directory." -ForegroundColor Green
Write-Host "To preview the production build, run: npm run preview" -ForegroundColor Cyan
