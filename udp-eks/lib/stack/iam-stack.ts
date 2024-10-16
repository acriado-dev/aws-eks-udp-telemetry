import {SecretValue, Stack, StackProps} from "aws-cdk-lib";
import {Group, ManagedPolicy, User} from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";


export class IamStack extends Stack {
    readonly realTimeApplicationUsers: User[];
    readonly realTimePlatformUsers: User[];


    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.realTimeApplicationUsers = [];
        this.realTimePlatformUsers = [];

        const RealTimeApplicationManagedPolicies = [
            ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
            ManagedPolicy.fromAwsManagedPolicyName('AmazonCognitoPowerUser'),
            ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'),
            ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess'),
            ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')
        ];

        const RealTimePlatformManagedPolicies = [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')];

        const realTimeApplicationTeamGroup = new Group(this, `real-time-application-team-iam-group`, {
            groupName: 'REAL_TIME_APPLICATION',
            managedPolicies: RealTimeApplicationManagedPolicies
        });
        const realTimePlatformTeamGroup = new Group(this, `real-time-platform-team-iam-group`, {
            groupName: 'REAL_TIME_PLATFORM',
            managedPolicies: RealTimePlatformManagedPolicies
        });

        const usersApplicationList: string[] = JSON.parse(process.env.REAL_TIME_APPLICATION_USERS!);
        this.createIamUsers(usersApplicationList, realTimeApplicationTeamGroup, this.realTimeApplicationUsers)

        const usersPlatformList: string[] = JSON.parse(process.env.REAL_TIME_PLATFORM_USERS!);
        this.createIamUsers(usersPlatformList, realTimePlatformTeamGroup, this.realTimePlatformUsers)

    }

    /**
     * Generates IAM users from the Array of usernames received by parameter.
     * @private
     */
    private createIamUsers(usersList: string[], iamGroup: Group, iamUsers: User[]) {
        usersList.forEach((userNameItem) => {
            const user = new User(this, `real-time-${userNameItem}`, {
                userName: userNameItem,
                groups: [iamGroup],
                ...(process.env.REAL_TIME_USERS_DEFAULT_TMP_PASSWORD && {
                    password: SecretValue.unsafePlainText(process.env.REAL_TIME_USERS_DEFAULT_TMP_PASSWORD),
                    passwordResetRequired: true
                })
            });

            iamUsers.push(user);
        });

        return iamUsers;
    }
}
