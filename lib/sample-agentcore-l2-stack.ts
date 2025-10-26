import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import * as agentcore from "@aws-cdk/aws-bedrock-agentcore-alpha";
import * as iam from "aws-cdk-lib/aws-iam";
import * as bedrock from "@aws-cdk/aws-bedrock-alpha";

export class SampleAgentcoreL2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const agentRuntimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
      path.join(__dirname, "../agent"),
    );

    const runtime = new agentcore.Runtime(this, "StrandsAgentRuntime", {
      runtimeName: "simpleStrandsAgent",
      agentRuntimeArtifact: agentRuntimeArtifact,
      description: "Simple Strands Agent with weather tool",
    });

    // ========================================
    // 方法1: addToRolePolicy()を使った権限付与（現在採用）
    // ========================================
    runtime.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
        ],
        resources: [
          // All foundation models in current region
          `arn:aws:bedrock:${this.region}::foundation-model/*`,
        ],
      }),
    );

    // ========================================
    // 方法2: BedrockFoundationModel.grantInvoke()を使った権限付与
    // ========================================
    // 特定のモデルに対して権限を付与する場合
    // 注意: @aws-cdk/aws-bedrock-alphaパッケージが必要（alpha版）
    //
    // const model =
    //   bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0;
    // model.grantInvoke(runtime);

    // ========================================
    // 方法3: CrossRegionInferenceProfile.grantInvoke()を使った権限付与
    // ========================================
    // クロスリージョンの推論プロファイルを使う場合
    // 複数リージョンでのモデル呼び出しを最適化
    // 注意: @aws-cdk/aws-bedrock-alphaパッケージが必要（alpha版）
    //
    // const inferenceProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
    //   geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
    //   model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0,
    // });
    // inferenceProfile.grantInvoke(runtime);

    new cdk.CfnOutput(this, "RuntimeArn", {
      value: runtime.agentRuntimeArn,
      description: "ARN of the AgentCore Runtime",
      exportName: "AgentRuntimeArn",
    });

    new cdk.CfnOutput(this, "RuntimeId", {
      value: runtime.agentRuntimeId,
      description: "ID of the AgentCore Runtime",
      exportName: "AgentRuntimeId",
    });
  }
}
