# Virya CleanTech Newsletter

The sender uses the existing Google Sheets and Resend environment variables in
`Website/FrontEnd/.env.local`. It does not require new environment variables.

Newsletter copy and service links come from the website's service and insight
data. The existing `Leads` sheet is read only in its Service column to choose
the featured topic. Names, email addresses and other lead fields are not read
or used. Test messages go only to the configured `MAIL_TO` address; the sheet
is not treated as a newsletter subscriber list.

Run from the workspace root in PowerShell:

```powershell
Push-Location .\Website\FrontEnd
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --preview
Pop-Location
```

To send five clearly labeled test messages to `MAIL_TO`, replace `--preview`
with `--send-test 5`. The sender rejects counts above five and sends no mail
unless `--send-test` is explicitly provided.