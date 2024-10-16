


## CDK
```
cdk deploy --profile amatore-macos --all
```

## EKS

- Update kubeconfig to Access to the cluster:
```
aws eks update-kubeconfig --name real-time-platform-cluster-develop --region eu-central-1 --role-arn arn:aws:iam::XXXXXXXX:role/UdpInfraStackeksudpinfrac-realtimeplatformclusterde-ABdLj7XOh4Br --profile amatore-macos
```

- View active context
```
kubectl config get-contexts
```

- View config:
```
kubectl config view --minify
```

## ArgoCD
```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.11.9/manifests/install.yaml
```


### Github SSH key
- 
- Create Github SSH key
```
ssh-keygen -t ed25519 -C "amatore@gmail.com"
```

- Copy public key to Github
- Create Secret in ArgoCD mamespace with private key
```
kubectl create secret generic github-ssh-key \
--from-file=sshPrivateKey=id_ed25519 \
-n gitops
```

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
