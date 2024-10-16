import {Construct} from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import {
    AwsLoadBalancerControllerAddOn,
    ClusterAddOn,
    EksBlueprint,
    GlobalResources, Team
} from "@aws-quickstart/eks-blueprints";
import {CapacityType, KubernetesVersion} from "aws-cdk-lib/aws-eks";
import {InstanceType, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {RealTimePlatformVpc} from "../networking/RealTimePlatformVpc";
import {StackProps} from "aws-cdk-lib";
import {User} from "aws-cdk-lib/aws-iam";
import {RealTimePlatformTeam} from "../teams/RealTimePlatformTeam";
import {RealTimeApplicationTeam} from "../teams/RealTimeApplicationTeam";

export default class ClusterConstruct extends Construct {
    loadBalancerAddOn: blueprints.ClusterAddOn;
    vpcCniAddon: blueprints.ClusterAddOn;
    ebsCsiDriverAddOn: blueprints.EbsCsiDriverAddOn;
    metricsServerAddon: blueprints.MetricsServerAddOn;
    clusterAutoscalerAddOn: blueprints.ClusterAutoScalerAddOn;
    addOns: Array<blueprints.ClusterAddOn> = [];
    readonly environment: string;
    readonly namespace: string;
    private bootstrapArgoAddOn: ClusterAddOn;

    realTimeApplicationTeam: RealTimeApplicationTeam;
    realTimePlatformTeam: RealTimePlatformTeam;
    clusterTeams: Team[] = [];


    constructor(scope: Construct,
                id: string,
                realTimeApplicationUsers: User[],
                realTimePlatformUsers: User[],
                vpc:Vpc,
                props?: StackProps) {
        super(scope, id);
        this.environment = process.env.ENVIRONMENT!;
        this.namespace = process.env.DEFAULT_NAMESPACE!;

        this.initTeams(realTimeApplicationUsers, realTimePlatformUsers, this.namespace);
        this.initAddons();
        const clusterProvider = this.getGenericClusterProvider(this.environment);
        const eksBlueprint = EksBlueprint.builder()
            .clusterProvider(clusterProvider)
            .resourceProvider(GlobalResources.Vpc, new RealTimePlatformVpc(vpc))
            .addOns(...this.addOns)
            .version(KubernetesVersion.V1_30)

        eksBlueprint.teams(...this.clusterTeams);
        eksBlueprint.build(scope, "eks-udp-infra-cluster");
    }

    private initAddons() {
        this.loadBalancerAddOn = new AwsLoadBalancerControllerAddOn({
            enableWafv2: true,
            enableShield: true,
            createIngressClassResource: true
        });
        this.vpcCniAddon = new blueprints.addons.VpcCniAddOn();
        this.ebsCsiDriverAddOn = new blueprints.addons.EbsCsiDriverAddOn();
        this.metricsServerAddon = new blueprints.addons.MetricsServerAddOn();
        this.clusterAutoscalerAddOn = new blueprints.addons.ClusterAutoScalerAddOn();

        this.addOns = [
            this.loadBalancerAddOn,
            this.vpcCniAddon,
            this.ebsCsiDriverAddOn,
            this.clusterAutoscalerAddOn,
            this.metricsServerAddon,
        ];
    }

    /**
     *
     * @param realTimeApplicationUsers
     * @param realTimePlatformUsers
     * @param namespace
     * @private
     */
    private initTeams(realTimeApplicationUsers: User[], realTimePlatformUsers: User[], namespace: string) {

        this.realTimeApplicationTeam = new RealTimeApplicationTeam('real-time-application-team',realTimeApplicationUsers, namespace);
        this.clusterTeams.push(this.realTimeApplicationTeam);

        this.realTimePlatformTeam = new RealTimePlatformTeam('real-time-platform-team', realTimePlatformUsers);
        this.clusterTeams.push(this.realTimePlatformTeam);

    }
    private getGenericClusterProvider(environment: string) {
        switch (environment) {
            case 'develop':
                return new blueprints.GenericClusterProvider({
                    clusterName: 'real-time-platform-cluster-develop',
                    version: KubernetesVersion.V1_30,
                    managedNodeGroups: [
                        {
                            id: "mng1-spot-arm",
                            instanceTypes: [new InstanceType("c6g.medium")],
                            minSize: 1,
                            desiredSize: 2,
                            maxSize: 4,
                            nodeGroupSubnets: {subnetType:SubnetType.PRIVATE_WITH_EGRESS},
                            nodeGroupCapacityType: CapacityType.SPOT,
                        }
                    ]
                });
            case 'prod': //TBD
                return new blueprints.GenericClusterProvider({
                    clusterName: 'real-time-platform-cluster-prod',
                    version: KubernetesVersion.V1_30,
                    managedNodeGroups: [
                        {
                            id: "mng1",
                            instanceTypes: [new InstanceType("t3.medium")],
                            desiredSize: 2,
                        }
                    ]
                });
            default:
                throw new Error(`Unknown environment: ${environment}`);
        }
    }

}
