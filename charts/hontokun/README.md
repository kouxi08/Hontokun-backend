# Hontokun Backend
---
## install 
---
create secret and apply
```
apiVersion: v1
kind: Secret
metadata:
  name: hontokun-secret
type: Opaque
data:
  cms-service-domain: <microCMS-service-domain base64 encode>
  cms-api-key: <microCMS-api-key base64 encode>
  database-url: <databaseurl base64 encode>
  service-account-file.json: <firebase-file base64 encode>
```