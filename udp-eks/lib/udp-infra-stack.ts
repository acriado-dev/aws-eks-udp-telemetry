import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import ClusterConstruct from "./stack/eks-pipeline-stack";
import {NetworkingStack} from "./stack/networking-stack";
import {IamStack} from "./stack/iam-stack";

export class UdpInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const account = process.env.AWS_DEFAULT_ACCOUNT!;
    const region = process.env.AWS_DEFAULT_REGION!;
    const envRealTime = { account: account, region: region };

    // Nested Stacks
    const iamStack = new IamStack(this, 'IamStack', {env: envRealTime});
    const networkingStack = new NetworkingStack(this, 'NetworkingStack', {env: envRealTime});
    new ClusterConstruct(this,
        'ClusterConstruct',
        iamStack.realTimeApplicationUsers,
        iamStack.realTimePlatformUsers,
        networkingStack.vpc,
        {env: envRealTime});



  }
}
