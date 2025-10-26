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

## 動作確認

デプロイ後、AWS コンソールから、テスト > エージェントサンドボックス タブでペイロードを送信してみます。

```json
{
  "prompt": "東京の天気を教えて"
}
```
