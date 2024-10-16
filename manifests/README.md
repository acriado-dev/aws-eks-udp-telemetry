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


## Install minikube

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

### Install argoCD on minikube
- First ensure that the correct kubernetes context is selected

```
(base) amatore@MacBook-Pro ~ % kubectl config current-context
minikube
```

- Create namespace for argocd

```
kubectl create namespace argocd
```

- Get the latest argocd release. I recommend to get the Non-HA (Single node) deployment, but that depends on the specific needs of each project:

```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.12.4/manifests/install.yaml
```

- Port forwarding from the argocd-server service:

```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
- Get the initial admin password:
```
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
xKeUWYoqrPAxDpxx
```

- Now it's possible to Login to minikube at localhost:8080 using the 'admin' user and initial password 

