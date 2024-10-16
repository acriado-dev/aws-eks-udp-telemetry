import { ArnPrincipal, User } from 'aws-cdk-lib/aws-iam';

export function getUsersArnPrincipals(users: User[]) {
  const arnPrincipals: ArnPrincipal[] = [];
  users.forEach((item) => {
    arnPrincipals.push(new ArnPrincipal(item.userArn));
  });
  return arnPrincipals;
}
