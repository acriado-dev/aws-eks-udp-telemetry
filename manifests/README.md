## Create Docker Hub secret

```
kubectl create secret --namespace real-time-platform docker-registry regcred --docker-username=acriadodev --docker-password="XXXXXXXXXXX" --docker-email=hello@amatore.dev
```

## Apply kustomize overlay

```
(base) ~/Documents/GitHub/aws-eks-udp-telemetry/manifests/overlays/develop git:[main]
kubectl apply -n real-time-udp-telemetry -k ./
configmap/configmap-real-time-udp-listener created
configmap/configmap-real-time-websocket-server created
configmap/general-cfg created
secret/general-secret created
service/real-time-udp-listener-service created
deployment.apps/real-time-udp-listener created
deployment.apps/real-time-websocket-server created
```
