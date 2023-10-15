"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevIqCdkStack = void 0;
const cdk = require("aws-cdk-lib");
const fs = require("fs");
const yaml = require("js-yaml");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const eks = require("aws-cdk-lib/aws-eks");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
class DevIqCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Creating DynamoDB Tables
        const commitActivityTable = new dynamodb.Table(this, "CommitActivityTable", {
            tableName: "CommitActivity",
            partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const pullrequestActivityTable = new dynamodb.Table(this, "PullrequestActivityTable", {
            tableName: "PullrequestActivity",
            partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        const issueActivityTable = new dynamodb.Table(this, "IssueActivityTable", {
            tableName: "IssueActivity",
            partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // Create VPC
        const vpc = new ec2.Vpc(this, "DevIqVpc", {
            maxAzs: 2,
            natGateways: 1,
        });
        // Create EKS Cluster. subnets are automatically created, 1 private and 1 public. Security Group also default one.
        const cluster = new eks.FargateCluster(this, "DevIqEksCluster", {
            vpc: vpc,
            version: eks.KubernetesVersion.V1_27,
        });
        // IAM Role for Fargate EKS pod execution permission.
        const fargateRole = new iam.Role(this, "FargateEKSDynamoDBRole", {
            assumedBy: new iam.ServicePrincipal("eks-fargate-pods.amazonaws.com"),
            roleName: "FargateEKSDynamoDBRole",
        });
        // Granting permissions to the role to access DynamoDB
        fargateRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan",
            ],
            resources: [
                commitActivityTable.tableArn,
                pullrequestActivityTable.tableArn,
                issueActivityTable.tableArn,
            ],
        }));
        // Granting permissions to the role to access ECR i think following are automatically added
        // fargateRole.addToPolicy(
        //   new iam.PolicyStatement({
        //     actions: [
        //       "ecr:GetAuthorizationToken",
        //       "ecr:GetDownloadUrlForLayer",
        //       "ecr:BatchGetImage",
        //       "ecr:BatchCheckLayerAvailability",
        //     ],
        //     resources: ["*"],
        //   })
        // );
        //     // Service Role Policy
        // fargateRole.addToPolicy(
        //   new iam.PolicyStatement({
        //     actions: [
        //       "ec2:CreateNetworkInterface",
        //       "ec2:CreateNetworkInterfacePermission",
        //       "ec2:DeleteNetworkInterface",
        //       "ec2:DescribeNetworkInterfaces",
        //       "ec2:DescribeSecurityGroups",
        //       "ec2:DescribeSubnets",
        //       "ec2:DescribeVpcs",
        //       "ec2:DescribeDhcpOptions",
        //       "ec2:DescribeRouteTables"
        //     ],
        //     resources: ["*"],
        //   })
        // );
        // Fargate profile
        cluster.addFargateProfile("DevIqFargateProfile", {
            selectors: [{ namespace: "default" }],
            podExecutionRole: fargateRole,
        });
        // const clusterOidcProvider = new iam.OpenIdConnectProvider(this, 'ClusterOidcProvider', {
        //   url: cluster.clusterOpenIdConnectIssuerUrl,
        //   clientIds: ['sts.amazonaws.com'],
        // });
        // const albControllerPolicy = new iam.PolicyDocument({
        //   statements: [
        //   ],
        // });
        // const albControllerRole = new iam.Role(this, 'AlbControllerRole', {
        //   assumedBy: new iam.FederatedPrincipal(
        //     clusterOidcProvider.openIdConnectProviderArn,
        //     { StringEquals: { 'sts:aud': 'sts.amazonaws.com' } },
        //     'sts:AssumeRoleWithWebIdentity'
        //   ),
        //   inlinePolicies: {
        //     'AlbControllerPolicy': albControllerPolicy,
        //   },
        // });
        const files = ["commit-tracker.yaml"];
        let allManifestObjects = [];
        files.forEach((file) => {
            const content = fs.readFileSync(file, "utf8");
            const objects = yaml.loadAll(content);
            allManifestObjects = allManifestObjects.concat(objects);
        });
        new eks.KubernetesManifest(this, "CommitTrackerManifest", {
            cluster: cluster,
            manifest: allManifestObjects,
        });
    }
}
exports.DevIqCdkStack = DevIqCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LWlxLWNkay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldi1pcS1jZGstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFaEMscURBQXFEO0FBQ3JELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBRTNDLE1BQWEsYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsMkJBQTJCO1FBQzNCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUM1QyxJQUFJLEVBQ0oscUJBQXFCLEVBQ3JCO1lBQ0UsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUN2RSxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUM5RCxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FDRixDQUFDO1FBRUYsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQ2pELElBQUksRUFDSiwwQkFBMEIsRUFDMUI7WUFDRSxTQUFTLEVBQUUscUJBQXFCO1lBQ2hDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUs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QUVILDJGQUEyRjtRQUMzRixnREFBZ0Q7UUFDaEQsc0NBQXNDO1FBQ3RDLE1BQU07UUFFTix1REFBdUQ7UUFDdkQsa0JBQWtCO1FBQ2xCLE9BQU87UUFDUCxNQUFNO1FBRU4sc0VBQXNFO1FBQ3RFLDJDQUEyQztRQUMzQyxvREFBb0Q7UUFDcEQsNERBQTREO1FBQzVELHNDQUFzQztRQUN0QyxPQUFPO1FBQ1Asc0JBQXNCO1FBQ3RCLGtEQUFrRDtRQUNsRCxPQUFPO1FBQ1AsTUFBTTtRQUNOLE1BQU0sS0FBSyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN0QyxJQUFJLGtCQUFrQixHQUEwQixFQUFFLENBQUM7UUFFbkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ3hELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRSxrQkFBa0I7U0FDN0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBakpELHNDQWlKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgeWFtbCA9IHJlcXVpcmUoXCJqcy15YW1sXCIpO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCAqIGFzIGVrcyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVrc1wiO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuZXhwb3J0IGNsYXNzIERldklxQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBDcmVhdGluZyBEeW5hbW9EQiBUYWJsZXNcbiAgICBjb25zdCBjb21taXRBY3Rpdml0eVRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKFxuICAgICAgdGhpcyxcbiAgICAgIFwiQ29tbWl0QWN0aXZpdHlUYWJsZVwiLFxuICAgICAge1xuICAgICAgICB0YWJsZU5hbWU6IFwiQ29tbWl0QWN0aXZpdHlcIixcbiAgICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwidXNlcm5hbWVcIiwgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgICAgc29ydEtleTogeyBuYW1lOiBcImRhdGVcIiwgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgcHVsbHJlcXVlc3RBY3Rpdml0eVRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKFxuICAgICAgdGhpcyxcbiAgICAgIFwiUHVsbHJlcXVlc3RBY3Rpdml0eVRhYmxlXCIsXG4gICAgICB7XG4gICAgICAgIHRhYmxlTmFtZTogXCJQdWxscmVxdWVzdEFjdGl2aXR5XCIsXG4gICAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcInVzZXJuYW1lXCIsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICAgIHNvcnRLZXk6IHsgbmFtZTogXCJkYXRlXCIsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGlzc3VlQWN0aXZpdHlUYWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCBcIklzc3VlQWN0aXZpdHlUYWJsZVwiLCB7XG4gICAgICB0YWJsZU5hbWU6IFwiSXNzdWVBY3Rpdml0eVwiLFxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwidXNlcm5hbWVcIiwgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICAgIHNvcnRLZXk6IHsgbmFtZTogXCJkYXRlXCIsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSBWUENcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCBcIkRldklxVnBjXCIsIHtcbiAgICAgIG1heEF6czogMiwgLy8gMiBhdmFpbGFiaWxpdHkgem9uZXNcbiAgICAgIG5hdEdhdGV3YXlzOiAxLFxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIEVLUyBDbHVzdGVyLiBzdWJuZXRzIGFyZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQsIDEgcHJpdmF0ZSBhbmQgMSBwdWJsaWMuIFNlY3VyaXR5IEdyb3VwIGFsc28gZGVmYXVsdCBvbmUuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuRmFyZ2F0ZUNsdXN0ZXIodGhpcywgXCJEZXZJcUVrc0NsdXN0ZXJcIiwge1xuICAgICAgdnBjOiB2cGMsXG4gICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjcsXG4gICAgfSk7XG5cbiAgICAvLyBJQU0gUm9sZSBmb3IgRmFyZ2F0ZSBFS1MgcG9kIGV4ZWN1dGlvbiBwZXJtaXNzaW9uLlxuICAgIGNvbnN0IGZhcmdhdGVSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsIFwiRmFyZ2F0ZUVLU0R5bmFtb0RCUm9sZVwiLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChcImVrcy1mYXJnYXRlLXBvZHMuYW1hem9uYXdzLmNvbVwiKSxcbiAgICAgIHJvbGVOYW1lOiBcIkZhcmdhdGVFS1NEeW5hbW9EQlJvbGVcIixcbiAgICB9KTtcblxuICAgIC8vIEdyYW50aW5nIHBlcm1pc3Npb25zIHRvIHRoZSByb2xlIHRvIGFjY2VzcyBEeW5hbW9EQlxuICAgIGZhcmdhdGVSb2xlLmFkZFRvUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgXCJkeW5hbW9kYjpQdXRJdGVtXCIsXG4gICAgICAgICAgXCJkeW5hbW9kYjpHZXRJdGVtXCIsXG4gICAgICAgICAgXCJkeW5hbW9kYjpVcGRhdGVJdGVtXCIsXG4gICAgICAgICAgXCJkeW5hbW9kYjpRdWVyeVwiLFxuICAgICAgICAgIFwiZHluYW1vZGI6U2NhblwiLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICBjb21taXRBY3Rpdml0eVRhYmxlLnRhYmxlQXJuLFxuICAgICAgICAgIHB1bGxyZXF1ZXN0QWN0aXZpdHlUYWJsZS50YWJsZUFybixcbiAgICAgICAgICBpc3N1ZUFjdGl2aXR5VGFibGUudGFibGVBcm4sXG4gICAgICAgIF0sXG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBHcmFudGluZyBwZXJtaXNzaW9ucyB0byB0aGUgcm9sZSB0byBhY2Nlc3MgRUNSIGkgdGhpbmsgZm9sbG93aW5nIGFyZSBhdXRvbWF0aWNhbGx5IGFkZGVkXG4gICAgLy8gZmFyZ2F0ZVJvbGUuYWRkVG9Qb2xpY3koXG4gICAgLy8gICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgLy8gICAgIGFjdGlvbnM6IFtcbiAgICAvLyAgICAgICBcImVjcjpHZXRBdXRob3JpemF0aW9uVG9rZW5cIixcbiAgICAvLyAgICAgICBcImVjcjpHZXREb3dubG9hZFVybEZvckxheWVyXCIsXG4gICAgLy8gICAgICAgXCJlY3I6QmF0Y2hHZXRJbWFnZVwiLFxuICAgIC8vICAgICAgIFwiZWNyOkJhdGNoQ2hlY2tMYXllckF2YWlsYWJpbGl0eVwiLFxuICAgIC8vICAgICBdLFxuICAgIC8vICAgICByZXNvdXJjZXM6IFtcIipcIl0sXG4gICAgLy8gICB9KVxuICAgIC8vICk7XG5cbiAgICAvLyAgICAgLy8gU2VydmljZSBSb2xlIFBvbGljeVxuXG4gICAgLy8gZmFyZ2F0ZVJvbGUuYWRkVG9Qb2xpY3koXG4gICAgLy8gICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgLy8gICAgIGFjdGlvbnM6IFtcbiAgICAvLyAgICAgICBcImVjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlXCIsXG4gICAgLy8gICAgICAgXCJlYzI6Q3JlYXRlTmV0d29ya0ludGVyZmFjZVBlcm1pc3Npb25cIixcbiAgICAvLyAgICAgICBcImVjMjpEZWxldGVOZXR3b3JrSW50ZXJmYWNlXCIsXG4gICAgLy8gICAgICAgXCJlYzI6RGVzY3JpYmVOZXR3b3JrSW50ZXJmYWNlc1wiLFxuICAgIC8vICAgICAgIFwiZWMyOkRlc2NyaWJlU2VjdXJpdHlHcm91cHNcIixcbiAgICAvLyAgICAgICBcImVjMjpEZXNjcmliZVN1Ym5ldHNcIixcbiAgICAvLyAgICAgICBcImVjMjpEZXNjcmliZVZwY3NcIixcbiAgICAvLyAgICAgICBcImVjMjpEZXNjcmliZURoY3BPcHRpb25zXCIsXG4gICAgLy8gICAgICAgXCJlYzI6RGVzY3JpYmVSb3V0ZVRhYmxlc1wiXG4gICAgLy8gICAgIF0sXG4gICAgLy8gICAgIHJlc291cmNlczogW1wiKlwiXSxcbiAgICAvLyAgIH0pXG4gICAgLy8gKTtcblxuICAgIC8vIEZhcmdhdGUgcHJvZmlsZVxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoXCJEZXZJcUZhcmdhdGVQcm9maWxlXCIsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiBcImRlZmF1bHRcIiB9XSxcbiAgICAgIHBvZEV4ZWN1dGlvblJvbGU6IGZhcmdhdGVSb2xlLFxuICAgIH0pO1xuXG4gICAgLy8gY29uc3QgY2x1c3Rlck9pZGNQcm92aWRlciA9IG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHRoaXMsICdDbHVzdGVyT2lkY1Byb3ZpZGVyJywge1xuICAgIC8vICAgdXJsOiBjbHVzdGVyLmNsdXN0ZXJPcGVuSWRDb25uZWN0SXNzdWVyVXJsLFxuICAgIC8vICAgY2xpZW50SWRzOiBbJ3N0cy5hbWF6b25hd3MuY29tJ10sXG4gICAgLy8gfSk7XG5cbiAgICAvLyBjb25zdCBhbGJDb250cm9sbGVyUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgLy8gICBzdGF0ZW1lbnRzOiBbXG4gICAgLy8gICBdLFxuICAgIC8vIH0pO1xuXG4gICAgLy8gY29uc3QgYWxiQ29udHJvbGxlclJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FsYkNvbnRyb2xsZXJSb2xlJywge1xuICAgIC8vICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkZlZGVyYXRlZFByaW5jaXBhbChcbiAgICAvLyAgICAgY2x1c3Rlck9pZGNQcm92aWRlci5vcGVuSWRDb25uZWN0UHJvdmlkZXJBcm4sXG4gICAgLy8gICAgIHsgU3RyaW5nRXF1YWxzOiB7ICdzdHM6YXVkJzogJ3N0cy5hbWF6b25hd3MuY29tJyB9IH0sXG4gICAgLy8gICAgICdzdHM6QXNzdW1lUm9sZVdpdGhXZWJJZGVudGl0eSdcbiAgICAvLyAgICksXG4gICAgLy8gICBpbmxpbmVQb2xpY2llczoge1xuICAgIC8vICAgICAnQWxiQ29udHJvbGxlclBvbGljeSc6IGFsYkNvbnRyb2xsZXJQb2xpY3ksXG4gICAgLy8gICB9LFxuICAgIC8vIH0pO1xuICAgIGNvbnN0IGZpbGVzID0gW1wiY29tbWl0LXRyYWNrZXIueWFtbFwiXTtcbiAgICBsZXQgYWxsTWFuaWZlc3RPYmplY3RzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBbXTtcblxuICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgXCJ1dGY4XCIpO1xuICAgICAgY29uc3Qgb2JqZWN0cyA9IHlhbWwubG9hZEFsbChjb250ZW50KTtcbiAgICAgIGFsbE1hbmlmZXN0T2JqZWN0cyA9IGFsbE1hbmlmZXN0T2JqZWN0cy5jb25jYXQob2JqZWN0cyk7XG4gICAgfSk7XG5cbiAgICBuZXcgZWtzLkt1YmVybmV0ZXNNYW5pZmVzdCh0aGlzLCBcIkNvbW1pdFRyYWNrZXJNYW5pZmVzdFwiLCB7XG4gICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgbWFuaWZlc3Q6IGFsbE1hbmlmZXN0T2JqZWN0cyxcbiAgICB9KTtcbiAgfVxufVxuIl19