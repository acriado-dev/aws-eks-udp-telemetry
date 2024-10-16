import {
  ApplicationTeam,
  GenerateSecretManagerProvider,
  LookupSecretsManagerSecretByName
} from '@aws-quickstart/eks-blueprints';
import { User } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import {getUsersArnPrincipals} from "../util/iam-utils";

export class RealTimeApplicationTeam extends ApplicationTeam {
  constructor(
    groupName: string,
    users: User[],
    namespace?: string
  ) {
    super({
      name: groupName,
      namespace: namespace ? namespace : process.env.DEFAULT_NAMESPACE,
      ...(users && users.length > 0 && { users: getUsersArnPrincipals(users) })
    });
  }
}
