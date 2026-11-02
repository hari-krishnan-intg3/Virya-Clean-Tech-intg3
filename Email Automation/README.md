# Virya CleanTech Email Automation & Outreach Engine

The email system uses the existing Resend environment variables in `Website/FrontEnd/.env.local`. It does not require new environment variables.

## 100 Production-Ready B2B Email Templates Catalog

A complete, role-specific catalog of 100 distinct email templates is located in:
- `Email Automation/emailTemplatesData.ts` (Typed TypeScript definitions)
- `Email Automation/100_Email_Templates_Catalog.md` (Human-readable markdown guide for sales & marketing)

### Categories Covered:
1. **Manufacturing & Heavy Industrial Decarbonization** (#001 - #012)
2. **Logistics, Warehousing & Fleet Electrification** (#013 - #025)
3. **Commercial Real Estate, Smart Buildings & SEZs** (#026 - #037)
4. **Battery Energy Storage (BESS) & Microgrid Resilience** (#038 - #048)
5. **Data Centers & Critical Power Infrastructure** (#049 - #058)
6. **Carbon Economics, EU CBAM & Global Export Defense** (#059 - #070)
7. **ESG Reporting, SEBI BRSR Core & Corporate Governance** (#071 - #080)
8. **Utilities, DISCOMs & High-Voltage Grid Modernization** (#081 - #090)
9. **Retail, Hospitality, Healthcare & Institutions** (#091 - #100)

## CLI Usage

Run from the `Website/FrontEnd` directory in PowerShell:

### 1. List All 100 Templates
```powershell
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --list
```

### 2. Preview a Specific Template (e.g. Template #59 - CBAM Defense)
```powershell
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --template 59
```

### 3. Send a Specific Template as a Test Email to `MAIL_TO`
```powershell
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --template 59 --send-test
```

### 4. Preview the Default 5 Sample Executive Roles
```powershell
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --preview
```

### 5. Send Sample Test Emails to `MAIL_TO`
```powershell
node --env-file=.env.local .\node_modules\tsx\dist\cli.mjs "..\..\Email Automation\sendNewsletter.ts" --send-test 5
```
