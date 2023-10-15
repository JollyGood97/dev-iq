import * as cdk from "aws-cdk-lib";
const fs = require("fs");
const yaml = require("js-yaml");
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlLayer } from "aws-cdk-lib/lambda-layer-kubectl";

export class DevIqCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating DynamoDB Tables
    const commitActivityTable = new dynamodb.Table(
      this,
      "CommitActivityTable",
      {
        tableName: "CommitActivity",
        partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const pullrequestActivityTable = new dynamodb.Table(
      this,
      "PullrequestActivityTable",
      {
        tableName: "PullrequestActivity",
        partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const issueActivityTable = new dynamodb.Table(this, "IssueActivityTable", {
      tableName: "IssueActivity",
      partitionKey: { name: "username", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "date", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const mastersRole = new iam.Role(this, "MastersRole", {
      // assumedBy: new iam.AccountRootPrincipal(),

      assumedBy: new iam.ArnPrincipal(
        "arn:aws:iam::840684697633:user/legion7_cli"
      ),
    });

    // Create EKS Cluster. subnets are automatically created, 1 private and 1 public. Security Group also default one.
    const cluster = new eks.FargateCluster(this, "DevIqEksCluster", {
      version: eks.KubernetesVersion.V1_26,
      kubectlLayer: new KubectlLayer(this, "kubectl"),
      mastersRole: mastersRole,
      albController: {
        version: eks.AlbControllerVersion.V2_5_1,
      },
    });

    // IAM Role for Fargate EKS pod execution permission.
    const fargateRole = new iam.Role(this, "FargateEKSRole", {
      assumedBy: new iam.ServicePrincipal("eks-fargate-pods.amazonaws.com"),
      roleName: "FargateEKSRole",
    });

    // Granting permissions to the role to access DynamoDB
    fargateRole.addToPolicy(
      new iam.PolicyStatement({
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
      })
    );

    // Granting permissions to the role to access ECR
    fargateRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
        ],
        resources: ["*"],
      })
    );

    // Fargate profile
    cluster.addFargateProfile("DevIqFargateProfile", {
      selectors: [{ namespace: "default" }],
      podExecutionRole: fargateRole,
    });

    const files = [
      "commit-tracker.yaml",
      "pullreq-tracker.yaml",
      "issue-tracker.yaml",
      "init.yaml",
      "init-cronjob.yaml",
      "api-gateway.yaml",
    ];
    let allManifestObjects: Record<string, any>[] = [];

    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      const objects = yaml.loadAll(content);
      allManifestObjects = allManifestObjects.concat(objects);
    });

    new eks.KubernetesManifest(this, "Manifests", {
      cluster: cluster,
      manifest: allManifestObjects,
    });
  }
}
