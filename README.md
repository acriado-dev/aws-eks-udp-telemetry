# aws-eks-udp-telemetry
Ingesting F1 telemetry UDP real time data in AWS EKS

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
