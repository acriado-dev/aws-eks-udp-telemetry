import {Stack, StackProps} from "aws-cdk-lib";
import {IpAddresses, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";


export class NetworkingStack extends Stack {

    vpc: Vpc;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const realTimeVpcCidr = process.env.REAL_TIME_VPC_CIDR;
        const environment = process.env.ENVIRONMENT!;

        if (!realTimeVpcCidr) throw new Error("REAL_TIME_VPC_CIDR is not defined");

        this.vpc = new Vpc(this, 'vpc-real-time-platform', {
            vpcName: `vpc-real-time-platform-${environment}`,
            ipAddresses: IpAddresses.cidr(realTimeVpcCidr),
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    name: 'public',
                    subnetType: SubnetType.PUBLIC
                },
                {
                    name: 'private',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS
                }]
            });


        }


}
