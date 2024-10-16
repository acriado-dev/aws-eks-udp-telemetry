import { PlatformTeam } from '@aws-quickstart/eks-blueprints';
import { User } from 'aws-cdk-lib/aws-iam';
import {getUsersArnPrincipals} from "../util/iam-utils";

export class RealTimePlatformTeam extends PlatformTeam {
  constructor(groupName: string, users?: User[]) {
    super({
      name: groupName,
      ...(users && users.length > 0 && { users: getUsersArnPrincipals(users) })
    });
  }
}
