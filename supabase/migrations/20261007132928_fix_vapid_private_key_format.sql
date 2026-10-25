/*
# Fix VAPID private key format for alarm delivery

1. Purpose
- Convert the server-only VAPID private key from a full DER/PKCS8-encoded value into the raw Base64URL private scalar required by the `web-push` library.
- This fixes the Edge Function's 500 responses when the scheduled alarm sender initializes VAPID signing.

2. Modified data
- `public.push_config.vapid_private_key`: replace only the stored credential representation with the matching raw private key for the existing public key.
- No tables, columns, alarms, subscriptions, or delivery records are deleted or changed.

3. Security
- `push_config` remains server-only and continues to have no client role privileges.
- The private key is not returned to the browser or exposed in application code.

4. Important notes
- The existing VAPID public key and scheduler token are unchanged.
- This migration is idempotent and only updates the single configuration row.
*/

UPDATE public.push_config
SET vapid_private_key = 'HOox8BiOS1z-0duY-ZQ2PqWNfokFmUVcN40rWl2dwgA'
WHERE id = 1
  AND vapid_private_key <> 'HOox8BiOS1z-0duY-ZQ2PqWNfokFmUVcN40rWl2dwgA';