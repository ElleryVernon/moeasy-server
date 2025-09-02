// DynamoDB 접근 레이어 (간단 래핑)
// 주석 삭제 금지, 주석 추가 및 개선은 허용

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Env } from "../env";
import type {
  MemberItem,
  RefreshTokenItem,
  QuestionItem,
  SurveyItem,
} from "./types";

export class Repo {
  constructor(
    private readonly doc: DynamoDBDocumentClient,
    private readonly env: Env
  ) {}

  private table(name: string) {
    return `${this.env.DYNAMODB_TABLE_PREFIX}__${name}`;
  }

  // RefreshToken
  async putRefreshToken(item: RefreshTokenItem) {
    await this.doc.send(
      new PutCommand({ TableName: this.table("refresh"), Item: item })
    );
  }
  async getRefreshToken(email: string): Promise<RefreshTokenItem | null> {
    const key = { pk: `refresh#${email}`, sk: "meta" } as const;
    const res = await this.doc.send(
      new GetCommand({ TableName: this.table("refresh"), Key: key })
    );
    return (res.Item as RefreshTokenItem) ?? null;
  }
  async deleteRefreshToken(email: string) {
    await this.doc.send(
      new UpdateCommand({
        TableName: this.table("refresh"),
        Key: { pk: `refresh#${email}`, sk: "meta" },
        UpdateExpression: "REMOVE token",
      })
    );
  }

  // Member
  async getMemberById(id: number): Promise<MemberItem | null> {
    const res = await this.doc.send(
      new QueryCommand({
        TableName: this.table("member"),
        IndexName: "byId",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as MemberItem) ?? null;
  }

  // Question
  async saveQuestion(item: QuestionItem) {
    await this.doc.send(
      new PutCommand({ TableName: this.table("question"), Item: item })
    );
  }
  async getQuestionById(id: number): Promise<QuestionItem | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.table("question"),
        Key: { pk: `question#${id}`, sk: "meta" },
      })
    );
    return (res.Item as QuestionItem) ?? null;
  }
  async listQuestionsByMember(memberId: number): Promise<QuestionItem[]> {
    const res = await this.doc.send(
      new QueryCommand({
        TableName: this.table("question"),
        IndexName: "byMemberCreated",
        KeyConditionExpression: "#memberId = :m",
        ExpressionAttributeNames: { "#memberId": "memberId" },
        ExpressionAttributeValues: { ":m": memberId },
        ScanIndexForward: false,
      })
    );
    return (res.Items as QuestionItem[]) ?? [];
  }
  async updateQuestionTitle(id: number, title: string) {
    await this.doc.send(
      new UpdateCommand({
        TableName: this.table("question"),
        Key: { pk: `question#${id}`, sk: "meta" },
        UpdateExpression: "SET #title = :t",
        ExpressionAttributeNames: { "#title": "title" },
        ExpressionAttributeValues: { ":t": title },
      })
    );
  }
  async updateQuestionQrUrl(id: number, url: string) {
    await this.doc.send(
      new UpdateCommand({
        TableName: this.table("question"),
        Key: { pk: `question#${id}`, sk: "meta" },
        UpdateExpression: "SET #url = :u",
        ExpressionAttributeNames: { "#url": "urlInQrCode" },
        ExpressionAttributeValues: { ":u": url },
      })
    );
  }
  async increaseQuestionCount(id: number) {
    await this.doc.send(
      new UpdateCommand({
        TableName: this.table("question"),
        Key: { pk: `question#${id}`, sk: "meta" },
        UpdateExpression: "ADD #count :one",
        ExpressionAttributeNames: { "#count": "count" },
        ExpressionAttributeValues: { ":one": 1 },
      })
    );
  }

  // Survey
  async saveSurvey(item: SurveyItem) {
    await this.doc.send(
      new PutCommand({ TableName: this.table("survey"), Item: item })
    );
  }
  async getSurveyByQuestionId(questionId: number): Promise<SurveyItem | null> {
    const res = await this.doc.send(
      new QueryCommand({
        TableName: this.table("survey"),
        IndexName: "byQuestion",
        KeyConditionExpression: "#q = :q",
        ExpressionAttributeNames: { "#q": "questionId" },
        ExpressionAttributeValues: { ":q": questionId },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as SurveyItem) ?? null;
  }
  async getSurveyById(id: number): Promise<SurveyItem | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.table("survey"),
        Key: { pk: `survey#${id}`, sk: "meta" },
      })
    );
    return (res.Item as SurveyItem) ?? null;
  }
  async updateSurveyResults(id: number, resultsJson: string) {
    await this.doc.send(
      new UpdateCommand({
        TableName: this.table("survey"),
        Key: { pk: `survey#${id}`, sk: "meta" },
        UpdateExpression: "SET #r = :r, #u = :now",
        ExpressionAttributeNames: { "#r": "resultsJson", "#u": "lastUpdated" },
        ExpressionAttributeValues: {
          ":r": resultsJson,
          ":now": new Date().toISOString(),
        },
      })
    );
  }
}
