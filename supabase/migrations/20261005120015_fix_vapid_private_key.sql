/*
# Fix truncated VAPID private key

1. Problem
- The `push_config` table has a truncated VAPID private key (43 chars instead of the full DER-encoded PKCS8 key).
- This causes the `send-alarm-push` edge function to fail when trying to send push notifications.
- As a result, no push notifications are delivered and the phone never vibrates.

2. Fix
- Update the VAPID private key with the correct full DER-encoded value from the original migration.
*/

UPDATE public.push_config
SET vapid_private_key = 'MIGHAgEAMBMGByqGSM49AwEHBG0wawIBAQQgHOox8BiOS1z-0duY-ZQ2PqWNfokFmUVcN40rWl2dwgChRANCAAQXK7tjyXcIoVtoKlPNPSrx8jvqluFpgAk9jYgeUxeyLrOa3dEaVahUOfRxtVhoQIBiKQJMaXAZXRHzFbtTgWqe'
WHERE id = 1;
