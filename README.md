# Amazon Bedrock AgentCore L2 Construct サンプル

AWS CDK v2.221.0 で追加された Amazon Bedrock AgentCore の L2 Construct を使って、Strands Agents をデプロイするサンプルコードです。

## 関連ブログ記事

詳細な解説はこちらのブログ記事をご覧ください：
[ブログ記事のリンク]

## 概要

このプロジェクトでは、以下を実装しています：

- **AgentCore Runtime**: L2 Construct を使ったシンプルなデプロイ
- **Strands Agents**: 天気情報を返すツールを持つシンプルなエージェント
- **Bedrock 権限設定**: 3つの方法を比較して実装

## プロジェクト構成

```
.
├── agent/
│   ├── agent.py              # Python Agent（Strands）
│   ├── requirements.txt      # Python依存関係
│   ├── Dockerfile           # コンテナ定義
│   └── .dockerignore
├── lib/
│   └── sample-agentcore-l2-stack.ts  # CDK Stack
├── bin/
│   └── sample-agentcore-l2.ts        # CDK App
└── package.json
```

## 前提条件

- Node.js v24.10.0 以降
- npm v11.6.1 以降
- Docker v27.5.1 以降
- AWS CLI 設定済み

## インストール

```bash
npm install
```

## デプロイ

```bash
# CloudFormation テンプレートを生成
npm run build

# デプロイ
npm run cdk deploy
```

## Bedrock 権限の3つの設定方法

このサンプルでは、Bedrock の権限を付与する3つの方法を紹介しています：

### 方法1: `addToRolePolicy()` を使う（現在採用）

```typescript
runtime.addToRolePolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
    resources: [`arn:aws:bedrock:${this.region}::foundation-model/*`],
  })
);
```

- ✅ 安定版のパッケージのみ使用
- ✅ 権限の範囲を柔軟にカスタマイズ可能

### 方法2: `BedrockFoundationModel.grantInvoke()`

```typescript
const model = bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0;
model.grantInvoke(runtime);
```

- ✅ コードがシンプル
- ❌ alpha版パッケージが必要

### 方法3: `CrossRegionInferenceProfile.grantInvoke()`

```typescript
const inferenceProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
  geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_HAIKU_V1_0
});
inferenceProfile.grantInvoke(runtime);
```

- ✅ クロスリージョン対応
- ❌ alpha版パッケージが必要

詳細は `lib/sample-agentcore-l2-stack.ts` のコメントを参照してください。

## 動作確認

デプロイ後、AWS コンソールの Amazon Bedrock → AgentCore → Runtimes からテストできます。

```json
{
  "prompt": "東京の天気を教えて"
}
```

## 参考資料

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Amazon Bedrock AgentCore L2 Construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-bedrock-agentcore-alpha-readme.html)
- [Strands Agents](https://github.com/strands-ai/strands-agents)

## ライセンス

MIT License
