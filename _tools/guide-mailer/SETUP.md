# Guide Mailer: one-time setup (about 10 minutes)

## 1. Sheet mein ek column jodo
Free Guides Sheet ke pehle tab mein column D ka heading likho: **Email**
- `Yes` = guide email par jayegi, aur person newsletter list mein jud jayega
- khaali = seedha Download button (pehle jaisa)

N8N guide ke liye ek row daalo:
`N8N Local Installation Guide | <description> | /g/n8n-guide-k7x2.pdf | Yes`

## 2. Script daalo
1. Sheet mein **Extensions > Apps Script** kholo
2. Jo code dikhe, hata do. `Code.gs` ka poora code paste karo. Save.

## 3. Brevo details daalo (Project Settings > Script properties)
| Property | Value |
|---|---|
| BREVO_API_KEY | Brevo > SMTP & API > API Keys > Generate |
| BREVO_LIST_ID | Brevo > Contacts > Lists, newsletter list ka ID number |
| SENDER_EMAIL | Brevo mein verified sender (jo abhi confirmation mail bhejta hai) |
| SENDER_NAME | AI Gurukool |

## 4. Test
Editor mein function `testSetup` chuno, **Run** dabao, permissions allow karo.
SENDER_EMAIL ke inbox mein test mail aana chahiye.

## 5. Deploy
**Deploy > New deployment > Web app**
- Execute as: **Me**
- Who has access: **Anyone**

Deploy karke jo URL mile (`https://script.google.com/macros/s/.../exec`), wo Claude ko de do.

## Roz ka kaam
Nayi guide = Sheet mein nayi row. Email se bhejni hai to D column mein `Yes`. Bas.
Kisne kaunsi guide li, "Requests" tab mein apne aap log hota rahega.

Reel CTA ke liye direct link: `aigurukool.in/resources/?get=guide-ka-title`
(title small letters, spaces ki jagah `-`, jaise `?get=n8n-local-installation-guide`)

## Column E: Show
- `Yes` = guide resources page pe sabko dikhegi
- khaali = page pe chhupi, sirf `?get=` link se khulegi (reel comment/DM ke liye)
- Jab tak column E ka heading khaali hai, saari guides dikhti hain
