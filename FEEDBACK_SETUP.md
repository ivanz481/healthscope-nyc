# Healthscope NYC — Feedback email setup

The Feedback tab, client-side validation and `/api/feedback` Vercel serverless function are deployed. **Email delivery is inactive until the variables below are configured.** The page automatically checks `GET /api/feedback` for readiness, disables submission until the service is configured, and only shows a submission success message after the email provider accepts the message.

## One-time owner setup

1. Create/sign in to a Resend account: https://resend.com.
2. Verify a domain for outgoing email under Resend Domains, then create an API key with permission to send email. Resend's testing sender can be used only within its testing limitations; verify your own sending domain for production.
3. Open Vercel → `healthscope-nyc` → Settings → Environment Variables, and add the following **server-side** values for Production:
   - `RESEND_API_KEY`: the secret API key generated in Resend.
   - `FEEDBACK_TO_EMAIL`: the private email address where you want Healthscope visitor feedback delivered.
   - `FEEDBACK_FROM_EMAIL`: a sender on your verified domain, for example `Healthscope NYC <feedback@your-verified-domain.example>`.
4. Redeploy the latest GitHub `main` deployment so the function receives the new environment variables.
5. Open `https://healthscope-nyc.vercel.app/api/feedback`. It should show `{"ok":true,"enabled":true}`. If it says false, review the environment variables and redeploy.
6. Open Feedback on the website, submit a short test message, and check the inbox you chose. Only consider the feature active after a real message arrives.

## Privacy and functionality

- Visitors can choose a topic, provide 12–4,000 characters of feedback, optionally rate the site and optionally provide a name/reply-to email.
- The email recipient and Resend API key remain server-side and are never shipped to the browser.
- Feedback is sent to Resend as a plain-text notification for delivery to the selected inbox. Do not promise HIPAA compliance or solicit personal medical details.
- The endpoint validates request origin, size, category, optional email, rate-limited minimum form time, and a honeypot. For a high-traffic site, add managed rate limiting and an anti-bot verification service.
- Submissions are not stored in a database. Your email inbox is the record of messages.
- If the email provider rejects the message, the user sees an error rather than a false success.

Official documentation:
- https://resend.com/docs/send-with-nodejs
- https://vercel.com/kb/guide/how-to-add-vercel-environment-variables
