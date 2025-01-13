# Hontokun Backend
```
npm install
npm run dev
```

```
open http://localhost:3000
```
## Installation
create secret
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
apply secret
```
kubectl apply -f <secret-name>
```
add repositry and install
```
# helm repo add hontokun-backend https://kouxi08.github.io/Hontokun-backend/
# helm install hontokun-backend hontokun/hontokun --create-namespace --namespace hontokun
```
