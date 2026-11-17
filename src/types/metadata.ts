export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL';
export interface MetadataTag { property: string; value: string; category: string; }
export interface MetadataResult { tags: MetadataTag[]; riskLevel: RiskLevel; riskReason: string; hasGps: boolean; latitude?: number; longitude?: number; metadataFound: boolean; parseStatus: 'SUCCESS' | 'EMPTY' | 'ERROR'; }
