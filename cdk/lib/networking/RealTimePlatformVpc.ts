import {ResourceContext, ResourceProvider} from "@aws-quickstart/eks-blueprints/dist/spi";
import {IVpc, Vpc} from "aws-cdk-lib/aws-ec2";

export  class RealTimePlatformVpc implements ResourceProvider<IVpc> {
    private readonly vpc: Vpc;
    constructor(vpc: Vpc) {
        this.vpc = vpc;
    }
    provide(context: ResourceContext): IVpc {
        return this.vpc;
    }
}
