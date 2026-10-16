# Virya CleanTech Newsletter

The sender uses the existing Google Sheets and Resend environment variables in
`Website/FrontEnd/.env.local`. It does not require new environment variables.

Newsletter copy and service links come from the website's service and insight
data. Test sends use five predefined business roles, each with a distinct
subject, personalized copy and featured service. They do not read lead names,
email addresses or other lead fields. Test messages go only to the configured
`MAIL_TO` address; the sheet is not treated as a newsletter subscriber list.

Run from the workspace root in PowerShell:

```powershell
Push-Location .\Website\FrontEnd
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --preview
Pop-Location
```

To send five clearly labeled, role-specific test messages to `MAIL_TO`, replace
`--preview` with `--send-test 5`. The sender rejects counts above five and sends
no mail unless `--send-test` is explicitly provided.