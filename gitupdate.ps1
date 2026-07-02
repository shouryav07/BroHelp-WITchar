$time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "Update - $time"
git push origin main